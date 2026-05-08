const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { User, CustomerProfile, VendorProfile } = require('../models');
const { sendVerificationEmail } = require('../services/email');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const googleOAuthClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const buildAuthPayload = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar_url: user.avatar_url || null,
    },
  };
};

const findOrCreateOAuthUser = async ({ provider, providerId, email, name, avatarUrl }) => {
  if (!email) {
    throw new Error('OAuth provider did not return an email address.');
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ where: { email: normalizedEmail } });

  if (existing) {
    const updates = {};
    if (!existing.provider || existing.provider === 'local') updates.provider = provider;
    if (!existing.provider_id && providerId) updates.provider_id = String(providerId);
    if (!existing.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
    if (!existing.verified) updates.verified = true;

    if (Object.keys(updates).length > 0) {
      await existing.update(updates);
    }

    return existing;
  }

  const user = await User.create({
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    password: null,
    role: 'customer',
    provider,
    provider_id: providerId ? String(providerId) : null,
    avatar_url: avatarUrl || null,
    verified: true,
    status: 'active',
  });

  await CustomerProfile.create({ user_id: user.id });
  return user;
};

/**
 * Register user (customer or vendor)
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required',
      });
    }

    // Validate role
    if (!['customer', 'vendor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be customer or vendor',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      verified: false,
      verification_token: verificationToken,
    });

    if (process.env.NODE_ENV !== 'production') {
      user.verified = true;
      user.verification_token = null;
      await user.save();
    }

    // Create customer profile if registering as customer
    if (role === 'customer') {
      await CustomerProfile.create({
        user_id: user.id,
      });
    }

    // Seed a starter vendor profile so vendor accounts have a dashboard entry immediately.
    if (role === 'vendor') {
      await VendorProfile.create({
        user_id: user.id,
        shop_name: name,
        address: 'Setup pending',
        city: 'Setup pending',
        state: 'Setup pending',
        pin_code: '000000',
        approval_status: 'pending',
        delivery_radius_km: 5,
        delivery_charge: 30,
        min_order_amount: 200,
      });
    }

    // Send verification email in production; local development users are auto-verified.
    if (process.env.NODE_ENV === 'production') {
      try {
        await sendVerificationEmail(user.email, verificationToken, role);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue with registration even if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // OAuth-only accounts have no password and must use their social provider
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: `This account uses ${user.provider} sign-in. Please continue with ${user.provider}.`,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is verified (except admin)
    if (user.role !== 'admin' && !user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
      });
    }

    // Check user status
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Verify email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const user = await User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user
    user.verified = true;
    user.verification_token = null;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get current user (requires authentication)
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'verified', 'status'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Google sign-in: verify ID token from Google Identity Services and issue JWT
 */
const googleAuth = async (req, res) => {
  try {
    if (!googleOAuthClient || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        success: false,
        message: 'Google login is not configured on the server.',
      });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google credential' });
    }

    const user = await findOrCreateOAuthUser({
      provider: 'google',
      providerId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.picture,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: buildAuthPayload(user),
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Unable to verify Google credential',
    });
  }
};

/**
 * Facebook sign-in: verify access token via Graph API and issue JWT
 */
const facebookAuth = async (req, res) => {
  try {
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Facebook login is not configured on the server.',
      });
    }

    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Facebook access token is required' });
    }

    const appToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const debugRes = await axios.get('https://graph.facebook.com/debug_token', {
      params: { input_token: accessToken, access_token: appToken },
    });
    const debugData = debugRes.data?.data;

    if (!debugData?.is_valid || debugData.app_id !== process.env.FACEBOOK_APP_ID) {
      return res.status(401).json({ success: false, message: 'Invalid Facebook access token' });
    }

    const profileRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture.type(large)',
        access_token: accessToken,
      },
    });
    const profile = profileRes.data;

    const user = await findOrCreateOAuthUser({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture?.data?.url,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: buildAuthPayload(user),
    });
  } catch (error) {
    console.error('Facebook auth error:', error.response?.data || error.message);
    return res.status(401).json({
      success: false,
      message: error.message || 'Unable to verify Facebook token',
    });
  }
};

/**
 * GitHub OAuth start - redirect the browser to GitHub's authorize page
 */
const githubInit = (req, res) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.redirect(
      `${FRONTEND_URL}/login?error=${encodeURIComponent('GitHub login is not configured on the server.')}`
    );
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${BACKEND_URL}/api/auth/github/callback`,
    scope: 'read:user user:email',
    allow_signup: 'true',
  });
  return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

/**
 * GitHub OAuth callback - exchange code, fetch profile, redirect to frontend with token
 */
const githubCallback = async (req, res) => {
  const failRedirect = (msg) =>
    res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(msg)}`);

  try {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return failRedirect('GitHub login is not configured.');
    }

    const { code } = req.query;
    if (!code) return failRedirect('Missing GitHub authorization code');

    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${BACKEND_URL}/api/auth/github/callback`,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenRes.data?.access_token;
    if (!accessToken) return failRedirect('GitHub did not return an access token');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'hyperlocal-delivery',
    };

    const [profileRes, emailsRes] = await Promise.all([
      axios.get('https://api.github.com/user', { headers }),
      axios.get('https://api.github.com/user/emails', { headers }),
    ]);

    const profile = profileRes.data;
    const emails = Array.isArray(emailsRes.data) ? emailsRes.data : [];
    const primaryEmail =
      emails.find((e) => e.primary && e.verified)?.email ||
      profile.email ||
      emails[0]?.email;

    if (!primaryEmail) return failRedirect('GitHub did not return a usable email address');

    const user = await findOrCreateOAuthUser({
      provider: 'github',
      providerId: profile.id,
      email: primaryEmail,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
    });

    const auth = buildAuthPayload(user);
    const userPayload = encodeURIComponent(JSON.stringify(auth.user));
    return res.redirect(
      `${FRONTEND_URL}/auth/callback#token=${auth.token}&user=${userPayload}`
    );
  } catch (error) {
    console.error('GitHub auth error:', error.response?.data || error.message);
    return failRedirect('Unable to authenticate with GitHub');
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  googleAuth,
  facebookAuth,
  githubInit,
  githubCallback,
};
