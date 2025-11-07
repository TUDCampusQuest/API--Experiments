import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID = 'MY_CLIENT_ID';

export function App() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Loading Google Identity Services…');
  const buttonRef = useRef(null);

  function decodeJwt(token) {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  }

  function handleCredentialResponse(resp) {
    try {
      const payload = decodeJwt(resp.credential);
      setUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      setStatus('Signed in');
    } catch (e) {
      setStatus('Failed to parse ID token payload');
    }
  }

  function verifyClientId(cid) {
    if (!cid) return 'Client ID is empty.';
    if (!/\.apps\.googleusercontent\.com$/.test(cid))
      return 'Not a Web client ID (must end with .apps.googleusercontent.com).';
    return '';
  }

  function initializeGsi() {
    const err = verifyClientId(GOOGLE_CLIENT_ID);
    if (err) {
      setStatus(`Config error: ${err}`);
      return;
    }
    if (!window.google?.accounts?.id) {
      setStatus('google.accounts.id API not available yet.');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
        auto_select: false,
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
        });
      }

      setStatus('Ready');
    } catch (e) {
      setStatus(`Init error: ${e?.message || e}`);
    }
  }

  useEffect(() => {
    if (window.google?.accounts?.id) {
      initializeGsi();
      return;
    }

    if (!document.querySelector('script[data-gsi]')) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.setAttribute('data-gsi', 'true');
      s.onload = initializeGsi;
      s.onerror = () => setStatus('Failed to load Google Identity script.');
      document.head.appendChild(s);
    } else {
      const tag = document.querySelector('script[data-gsi]');
      tag.addEventListener('load', initializeGsi, { once: true });
    }
  }, []);

  function handleSignOut() {
    try {
      window.google?.accounts.id.disableAutoSelect();
      if (user?.email) {
        window.google?.accounts.id.revoke(user.email, () => {});
      }
    } catch {}
    setUser(null);
    setStatus('Ready');
  }

  return (
    <div className="App">
      <h1>Google Sign-In Demo</h1>
      <h2>Authenticate with your Google account</h2>

      {!user && (
        <div className="panel">
          <div className="row">
            <span>Sign in</span>
            <div ref={buttonRef} id="gsi-btn-container" />
          </div>
        </div>
      )}

      {user && (
        <div className="card">
          <img className="avatar" src={user.picture} alt={user.name} />
          <div className="info">
            <div className="name">{user.name}</div>
            <div className="email">{user.email}</div>
          </div>
          <button className="btn secondary" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

console.log('Hello console');