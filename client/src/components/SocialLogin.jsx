import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// use inline SVG fallbacks for Facebook/GitHub icons to avoid lucide-react export mismatches
import { authAPI } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const GITHUB_ENABLED = process.env.REACT_APP_GITHUB_ENABLED === 'true';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const isPlaceholder = (value) =>
  !value || value.startsWith('your_') || value === 'undefined';

const loadScript = (src, id) =>
  new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('document is not available'));
      return;
    }
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

const dashboardPathFor = (role) =>
  role === 'admin'
    ? '/admin/dashboard'
    : role === 'vendor'
    ? '/vendor/dashboard'
    : '/customer/dashboard';

const SocialLogin = ({ onError }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const [busyProvider, setBusyProvider] = useState(null);

  const googleEnabled = !isPlaceholder(GOOGLE_CLIENT_ID);
  const facebookEnabled = !isPlaceholder(FACEBOOK_APP_ID);
  const githubEnabled = GITHUB_ENABLED;
  const anyEnabled = googleEnabled || facebookEnabled || githubEnabled;

  const reportError = useCallback(
    (message) => {
      if (onError) onError(message);
      else console.error(message);
    },
    [onError]
  );

  const finishLogin = useCallback(
    (token, user) => {
      login(token, user);
      const requestedPath = location.state?.from?.pathname;
      navigate(requestedPath || dashboardPathFor(user.role), { replace: true });
    },
    [login, location.state, navigate]
  );

  // Google Identity Services
  const handleGoogleResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        reportError('Google did not return a credential.');
        return;
      }
      setBusyProvider('google');
      try {
        const res = await authAPI.google(response.credential);
        const { token, user } = res.data.data;
        finishLogin(token, user);
      } catch (error) {
        reportError(
          error.response?.data?.message || 'Unable to sign in with Google.'
        );
      } finally {
        setBusyProvider(null);
      }
    },
    [finishLogin, reportError]
  );

  useEffect(() => {
    if (!googleEnabled) return undefined;
    let cancelled = false;

    loadScript('https://accounts.google.com/gsi/client', 'google-gsi-script')
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 320,
          });
        }
      })
      .catch(() => reportError('Failed to load Google sign-in.'));

    return () => {
      cancelled = true;
    };
  }, [googleEnabled, handleGoogleResponse, reportError]);

  // Facebook SDK
  const ensureFacebookSdk = useCallback(
    () =>
      loadScript(
        'https://connect.facebook.net/en_US/sdk.js',
        'facebook-jssdk'
      ).then(() => {
        if (!window.FB) throw new Error('Facebook SDK failed to initialize.');
        if (!window.FB.__hyperlocalInit) {
          window.FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: false,
            xfbml: false,
            version: 'v18.0',
          });
          window.FB.__hyperlocalInit = true;
        }
      }),
    []
  );

  const handleFacebookClick = useCallback(async () => {
    if (!facebookEnabled) return;
    setBusyProvider('facebook');
    try {
      await ensureFacebookSdk();
      window.FB.login(
        async (fbResponse) => {
          if (fbResponse.status !== 'connected' || !fbResponse.authResponse?.accessToken) {
            setBusyProvider(null);
            if (fbResponse.status !== 'unknown') {
              reportError('Facebook sign-in was cancelled.');
            }
            return;
          }
          try {
            const res = await authAPI.facebook(fbResponse.authResponse.accessToken);
            const { token, user } = res.data.data;
            finishLogin(token, user);
          } catch (error) {
            reportError(
              error.response?.data?.message || 'Unable to sign in with Facebook.'
            );
          } finally {
            setBusyProvider(null);
          }
        },
        { scope: 'public_profile,email' }
      );
    } catch (error) {
      reportError(error.message || 'Failed to load Facebook sign-in.');
      setBusyProvider(null);
    }
  }, [ensureFacebookSdk, facebookEnabled, finishLogin, reportError]);

  const handleGithubClick = useCallback(() => {
    if (!githubEnabled) return;
    setBusyProvider('github');
    window.location.href = `${BACKEND_URL}/api/auth/github`;
  }, [githubEnabled]);

  const FacebookIcon = ({ size = 18, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.797.716-1.797 1.765v2.316h3.59l-.467 3.622h-3.123V24h6.116C23.4 24 24 23.4 24 22.676V1.325C24 .6 23.4 0 22.675 0z" />
    </svg>
  );

  const GithubIcon = ({ size = 18, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297a12 12 0 00-3.793 23.397c.6.11.82-.26.82-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.525.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.654 1.651.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.62-5.48 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576A12 12 0 0012 .297z" />
    </svg>
  );

  if (!anyEnabled) return null;

  return (
    <div className="my-6">
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          or continue with
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="space-y-3">
        {googleEnabled && (
          <div className="flex justify-center">
            <div ref={googleButtonRef} aria-busy={busyProvider === 'google'} />
          </div>
        )}

        {facebookEnabled && (
          <button
            type="button"
            onClick={handleFacebookClick}
            disabled={!!busyProvider}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:border-[#1877F2] hover:text-[#1877F2] transition-colors disabled:opacity-60"
          >
            <FacebookIcon size={18} className="text-[#1877F2]" />
            {busyProvider === 'facebook' ? 'Connecting…' : 'Continue with Facebook'}
          </button>
        )}

        {githubEnabled && (
          <button
            type="button"
            onClick={handleGithubClick}
            disabled={!!busyProvider}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:border-slate-900 hover:text-slate-900 dark:hover:border-white dark:hover:text-white transition-colors disabled:opacity-60"
          >
            <GithubIcon size={18} />
            {busyProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialLogin;
