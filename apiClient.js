/**
 * TIPPED Portal — Global API Client, Fetch Interceptor, Toast System & Route Guards
 * File: /apiClient.js
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  //  1. GLOBAL TOAST NOTIFICATION ENGINE
  // ═══════════════════════════════════════════════
  let toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer || !document.body.contains(toastContainer)) {
      toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  const TOAST_ICONS = {
    success: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`,
    error: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
    warning: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
    info: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`
  };

  function showToast(type, message, title = null, duration = 4000) {
    if (!document.body) return;
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `tipped-toast tipped-toast--${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Notification'
    };

    const headerText = title || defaultTitles[type] || 'Notice';

    toast.innerHTML = `
      <div class="toast-icon-wrap">
        ${TOAST_ICONS[type] || TOAST_ICONS.info}
      </div>
      <div class="toast-content">
        <div class="toast-title">${headerText}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Close notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('tipped-toast--visible');
    });

    let dismissTimeout;
    const dismiss = () => {
      clearTimeout(dismissTimeout);
      toast.classList.remove('tipped-toast--visible');
      toast.classList.add('tipped-toast--hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    };

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);

    if (duration > 0) {
      dismissTimeout = setTimeout(dismiss, duration);
    }

    return { dismiss };
  }

  window.toast = {
    success: (msg, title, duration) => showToast('success', msg, title, duration),
    error: (msg, title, duration) => showToast('error', msg, title, duration),
    warning: (msg, title, duration) => showToast('warning', msg, title, duration),
    info: (msg, title, duration) => showToast('info', msg, title, duration)
  };

  // ═══════════════════════════════════════════════
  //  2. GLOBAL FETCH INTERCEPTOR & API CLIENT
  // ═══════════════════════════════════════════════
  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (resource, init = {}) {
    const options = { ...init };
    options.headers = new Headers(options.headers || {});

    // Attach JWT Authorization Bearer if present
    const token = sessionStorage.getItem('tipped_auth_token');
    if (token && !options.headers.has('Authorization')) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await originalFetch(resource, options);

      // Intercept HTTP Error Statuses
      if (!response.ok) {
        let errData = {};
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            errData = await response.clone().json();
          } else {
            errData = { message: await response.clone().text() };
          }
        } catch (e) {
          errData = { message: `Request failed with status ${response.status}` };
        }

        const errMsg = errData.message || `Error ${response.status}: ${response.statusText}`;

        // 401 Unauthorized Handling
        if (response.status === 401) {
          console.warn('🔒 [401 Unauthorized]: Clearing session credentials.');
          sessionStorage.removeItem('tipped_auth_token');
          sessionStorage.removeItem('tipped_user_id');
          sessionStorage.removeItem('tipped_user_role');

          const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/' || window.location.pathname.endsWith('login.html');
          if (!isLoginPage) {
            window.toast.error('Session expired or unauthorized. Redirecting to login...', 'Authentication Required');
            setTimeout(() => {
              window.location.href = '/login';
            }, 800);
          }
        }
        // 403 Forbidden Handling
        else if (response.status === 403) {
          window.toast.error('Access Denied: You do not have permission to perform this action.', 'Forbidden');
        }
        // 400 Bad Request
        else if (response.status === 400) {
          window.toast.error(errMsg, 'Validation Error');
        }
        // 500 Internal Server Error
        else if (response.status >= 500) {
          window.toast.error('Server error encountered. Please try again or contact Facilities Helpdesk.', 'Server Error');
        }
      }

      return response;
    } catch (networkError) {
      console.error('🌐 [Network/API Error]:', networkError);
      window.toast.error('Unable to reach campus network. Please verify your connection.', 'Network Offline');
      throw networkError;
    }
  };

  // High-level API Client Wrapper
  window.apiClient = {
    async request(url, method = 'GET', data = null, customHeaders = {}) {
      const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
      };
      const options = {
        method,
        headers
      };
      if (data && method !== 'GET' && method !== 'HEAD') {
        options.body = JSON.stringify(data);
      }

      const res = await window.fetch(url, options);
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const body = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        const error = new Error(body.message || `API error ${res.status}`);
        error.status = res.status;
        error.data = body;
        throw error;
      }
      return body;
    },

    get(url, headers = {}) {
      return this.request(url, 'GET', null, headers);
    },
    post(url, data, headers = {}) {
      return this.request(url, 'POST', data, headers);
    },
    patch(url, data, headers = {}) {
      return this.request(url, 'PATCH', data, headers);
    },
    delete(url, headers = {}) {
      return this.request(url, 'DELETE', null, headers);
    }
  };

  // ═══════════════════════════════════════════════
  //  3. CLIENT-SIDE ROUTE & ROLE PROTECTION GUARDS
  // ═══════════════════════════════════════════════
  function checkRouteProtection() {
    const path = window.location.pathname.toLowerCase();
    const isAdminRoute = path.startsWith('/admin') || path.endsWith('admin.html');
    const isLoginRoute = path === '/login' || path === '/' || path.endsWith('login.html') || path === '/register';

    const role = (sessionStorage.getItem('tipped_user_role') || '').toUpperCase();
    const hasName = sessionStorage.getItem('tipped_user_name');

    // Admin Route Protection
    if (isAdminRoute) {
      const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN' || role === 'STAFF';
      if (!isAdmin && hasName && role === 'USER') {
        console.warn('⛔ [Access Guard]: Non-admin user attempted to access /admin.');
        window.toast.error('Access Denied: Administrative credentials required.', 'Security Guard');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 600);
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  4. UI ERROR BOUNDARY RESILIENCY
  // ═══════════════════════════════════════════════
  window.addEventListener('error', function (event) {
    console.error('💥 [Global Script Error]:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', function (event) {
    console.error('💥 [Unhandled Promise Rejection]:', event.reason);
    if (window.toast && event.reason && event.reason.message) {
      // Avoid duplicated alert for already handled fetch errors
      if (!event.reason.status) {
        window.toast.error(event.reason.message || 'An unexpected operation error occurred.', 'Application Alert');
      }
    }
  });

  // Exported Helper for component render fallback
  window.renderUIErrorBoundary = function (containerSelector, errorMessage) {
    const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;

    container.innerHTML = `
      <div class="error-boundary-fallback">
        <div class="error-boundary-card">
          <div class="error-boundary-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 class="error-boundary-title">Component View Error</h2>
          <p class="error-boundary-text">
            ${errorMessage || 'An error occurred while loading this view component.'}
          </p>
          <div class="error-boundary-actions">
            <button type="button" onclick="window.location.reload()" class="btn-error-boundary-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Reload Section</span>
            </button>
            <a href="/dashboard" class="btn-error-boundary-secondary">
              <span>Return to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    `;
  };

  // Execute Guard on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkRouteProtection);
  } else {
    checkRouteProtection();
  }
})();
