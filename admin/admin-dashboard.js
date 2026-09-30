(() => {
  const status = document.getElementById('status');
  const who = document.getElementById('who');
  const securityStatus = document.getElementById('security-status');
  const sessionState = document.getElementById('session-state');

  const message = (text, error = false) => {
    status.textContent = text;
    status.className = 'admin-status ' + (error ? 'error' : '');
    clearTimeout(message.timer);
    message.timer = setTimeout(() => { status.textContent = ''; }, 5000);
  };

  async function api(url, options = {}) {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...options });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      if (url === '/api/admin/session') throw new Error('Admin session rejected.');
      window.location.href = '/admin/login.html';
      throw new Error('Session expired.');
    }
    if (!response.ok) throw new Error(data.error || 'Request could not be completed.');
    return data;
  }

  function showSection(sectionId, updateHash = true) {
    const sections = [...document.querySelectorAll('.admin-maintenance-section')];
    const navLinks = [...document.querySelectorAll('.admin-nav a[href^="#"]')];
    const overview = document.getElementById('overview');
    const target = sectionId === 'overview' ? overview : document.getElementById(sectionId);

    if (!target) return;
    sections.forEach(section => { section.hidden = section !== target; });
    overview.hidden = sectionId !== 'overview';

    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + sectionId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    if (updateHash) history.replaceState(null, '', '#' + sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initNavigation() {
    document.querySelectorAll('.admin-nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        showSection(link.getAttribute('href').slice(1));
      });
    });
    const requested = window.location.hash.slice(1);
    showSection(requested && document.getElementById(requested) ? requested : 'overview', false);
  }

  async function loadSession() {
    try {
      const data = await api('/api/admin/session');
      const name = data.username || 'Admin';
      who.textContent = name + ' · Active';
      securityStatus.textContent = 'Protected';
      sessionState.textContent = 'Protected';
    } catch (error) {
      who.textContent = 'Session expired';
      securityStatus.textContent = 'Attention';
      sessionState.textContent = 'Attention';
      message('Your secure admin session could not be verified. Please sign in again.', true);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin', cache: 'no-store' });
    window.location.href = '/admin/login.html';
  }

  document.getElementById('refresh')?.addEventListener('click', loadSession);
  document.getElementById('logout')?.addEventListener('click', logout);
  initNavigation();
  loadSession();
})();