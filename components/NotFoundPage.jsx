import React from 'react';

/**
 * TIPPED — 404 Not Found Component (React)
 * Clean catch-all component for routing fallbacks
 */
export default function NotFoundPage() {
  return (
    <div className="notfound-wrapper" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="notfound-card" style={{
        background: 'var(--color-surface, #1E293B)',
        border: '1px solid var(--color-surface-border, #334155)',
        borderRadius: '1.5rem',
        padding: '2.75rem 2.25rem',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.85rem',
          borderRadius: '999px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#F59E0B',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          marginBottom: '1.25rem'
        }}>
          <span>404 • Page Not Found</span>
        </div>

        <div style={{
          fontSize: '5rem',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: '#F59E0B',
          marginBottom: '0.75rem',
          fontFamily: 'monospace'
        }}>
          404
        </div>

        <h1 style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--color-text-primary, #FFFFFF)',
          marginBottom: '0.5rem'
        }}>
          Lost in Campus Space?
        </h1>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary, #94A3B8)',
          lineHeight: 1.55,
          marginBottom: '1.75rem'
        }}>
          The page or facilities record you were looking for does not exist or has been relocated.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <a
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: '0.75rem',
              background: '#F59E0B',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
