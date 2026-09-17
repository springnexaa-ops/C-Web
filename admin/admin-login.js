(() => {
  const form = document.getElementById('login-form');
  const token = document.getElementById('token');
  const err = document.getElementById('error');
  const btn = document.getElementById('submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Verifying secure token…';
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ token: token.value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Sign in failed.');
      token.value = '';
      window.location.replace('/admin/dashboard.html?v=20260917-2000');
    } catch (error) {
      err.textContent = error.message;
      err.hidden = false;
      token.focus();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Open secure console';
    }
  });
})();
