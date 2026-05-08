import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/BaseComponents';

const dashboardPathFor = (role) =>
  role === 'admin'
    ? '/admin/dashboard'
    : role === 'vendor'
    ? '/vendor/dashboard'
    : '/customer/dashboard';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    const userRaw = params.get('user');

    if (!token || !userRaw) {
      navigate('/login?error=Authentication%20failed', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      login(token, user);
      navigate(dashboardPathFor(user.role), { replace: true });
    } catch {
      navigate('/login?error=Authentication%20failed', { replace: true });
    }
  }, [login, navigate]);

  return <LoadingSpinner fullScreen />;
};

export default AuthCallbackPage;
