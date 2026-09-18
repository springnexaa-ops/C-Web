(() => {
  const form = document.getElementById('login-form');
  const token = document.getElementById('token');
  const err = document.getElementById('error');
  const btn = document.getElementById('submit');

  if (!form || !token || !err || !btn) return;

  const params = new URLSearchParams(window.location.search);
  const errorMap = {
    invalid: '❌ INVALID TOKEN — ADMIN_TOKEN was rejected by the server.',
    config: '⚠️ API CONFIGURATION ERROR — ADMIN_TOKEN is not configured in this Cloudflare deployment.',
    session: '⚠️ SESSION ERROR — the server could not create the admin session.'
  };
  const initialError = errorMap[params.get('error')];
  if (initialError) { err.textContent = initialError; err.hidden = false; }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    err.hidden = true;
    err.className = 'admin-error';
    btn.disabled = true;
    btn.textContent = 'Checking API…';
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Login': '1' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ token: token.value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || 'Authentication API rejected the request.');
      btn.textContent = '✓ API VALID — Checking session…';
      const session = await fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' });
      const sessionData = await session.json().catch(() => ({}));
      if (!session.ok || !sessionData.loggedIn) throw new Error('API accepted the token, but the browser did not retain a valid admin session cookie.');
      err.className = 'admin-success';
      err.textContent = '✓ SUCCESSFUL — Admin API valid and session established.';
      err.hidden = false;
      btn.textContent = '✓ SUCCESSFUL — Opening console…';
      setTimeout(() => window.location.replace('/admin/dashboard.html?v=20260918-admin-auth'), 350);
    } catch (error) {
      err.className = 'admin-error';
      err.textContent = '❌ ' + error.message;
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Open secure console';
      token.focus();
    }
  });
})();