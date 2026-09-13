(() => {
  const form = document.getElementById('login-form');
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  const err = document.getElementById('error');
  const btn = document.getElementById('submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username: user.value.trim(), password: pass.value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Sign in failed.');
      window.location.href = '/admin/dashboard.html';
    } catch (error) {
      err.textContent = error.message;
      err.hidden = false;
      pass.focus();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign in';
    }
  });
})();
