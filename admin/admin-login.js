(() => {
  const form = document.getElementById('login-form');
  const token = document.getElementById('token');
  const btn = document.getElementById('submit');

  if (!form || !token || !btn) return;

  form.addEventListener('submit', () => {
    if (!token.value.trim()) return;
    btn.disabled = true;
    btn.textContent = 'Verifying secure token…';
  });
})();
