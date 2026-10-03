import React, { useEffect, useState } from 'react';

/**
 * TIPPED — Admin Route Auth Guard (React)
 * Enforces role-based access control on /admin routes.
 * Redirects unauthorized non-admin users to /dashboard or /login with notification.
 */
export default function AdminGuard({ children, fallbackRedirect = '/dashboard' }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const role = (sessionStorage.getItem('tipped_user_role') || '').toUpperCase();
    const token = sessionStorage.getItem('tipped_auth_token') || sessionStorage.getItem('tipped_user_id');

    if (!token && !sessionStorage.getItem('tipped_user_name')) {
      // Unauthenticated -> redirect to login
      window.location.href = '/login';
      return;
    }

    if (role === 'ADMIN' || role === 'SUPERADMIN' || role === 'STAFF') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // Trigger user-friendly notice and redirect
      if (window.toast) {
        window.toast.error('Access Denied: Admin privileges required.');
      }
      setTimeout(() => {
        window.location.href = fallbackRedirect;
      }, 500);
    }
  }, [fallbackRedirect]);

  if (isAuthorized === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F172A',
        color: '#F59E0B',
        fontSize: '0.9rem',
        fontWeight: 700
      }}>
        Verifying administrative authorization...
      </div>
    );
  }

  return isAuthorized ? children : null;
}
