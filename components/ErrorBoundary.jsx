import React from 'react';

/**
 * TIPPED — UI Error Boundary (React)
 * Intercepts uncaught component render errors and displays a resilient fallback UI
 * preventing full application crashes.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('💥 [UI Error Boundary Caught Error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: '#0F172A',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: '#1E293B',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="28" height="28">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Something Went Wrong
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              An unexpected UI rendering error occurred. The application state has been preserved.
            </p>

            {this.state.error && (
              <pre style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '0.85rem 1rem',
                fontSize: '0.75rem',
                color: '#F87171',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                maxHeight: '120px'
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '0.75rem',
                  background: '#F59E0B',
                  color: '#0F172A',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reload Application
              </button>
              <a
                href="/dashboard"
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: '0.75rem',
                  background: 'transparent',
                  border: '1px solid #334155',
                  color: '#CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
