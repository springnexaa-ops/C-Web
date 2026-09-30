(() => {
  const items = document.getElementById('items');
  const status = document.getElementById('status');
  const who = document.getElementById('who');
  const fieldCount = document.getElementById('field-count');
  const repoStatus = document.getElementById('repo-status');
  let contentRows = [];

  const message = (text, error = false) => {
    status.textContent = text;
    status.className = `admin-status ${error ? 'error' : ''}`;
    clearTimeout(message.timer);
    message.timer = setTimeout(() => { status.textContent = ''; }, 5000);
  };

  async function api(url, options = {}) {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...options });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      if (url === '/api/admin/session') {
        const detail = data && data.error ? data.error : 'The Cloudflare admin session was rejected.';
        throw new Error(`Admin session rejected: ${detail}`);
      }
      window.location.href = '/admin/login.html';
      throw new Error('Session expired.');
    }
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  async function session() {
    const data = await api('/api/admin/session');
    who.textContent = data.username || 'ADMIN_TOKEN';
    return true;
  }

  function renderContent(rows) {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const visible = rows.filter(row => !query || `${row.key} ${row.value}`.toLowerCase().includes(query));
    items.innerHTML = '';
    if (!visible.length) { items.innerHTML = '<div class="admin-empty">No matching editable content.</div>'; return; }
    visible.forEach(row => {
      const card = document.createElement('article');
      card.className = 'admin-item';
      card.innerHTML = '<div class="admin-item-head"><span class="admin-key"></span><span class="admin-time"></span></div><textarea maxlength="10000"></textarea><div class="admin-item-foot"><span class="admin-dirty"></span><button class="admin-save" type="button">Save</button></div>';
      card.querySelector('.admin-key').textContent = row.key;
      card.querySelector('.admin-time').textContent = row.updated_at || '';
      const area = card.querySelector('textarea');
      area.value = row.value || '';
      area.addEventListener('input', () => card.querySelector('.admin-dirty').classList.add('show'));
      card.querySelector('button').addEventListener('click', async () => {
        const button = card.querySelector('button');
        button.disabled = true; button.textContent = 'Saving…';
        try {
          await api('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: row.key, value: area.value }) });
          row.value = area.value; row.updated_at = new Date().toISOString();
          button.textContent = 'Saved ✓'; card.querySelector('.admin-dirty').classList.remove('show'); message('Website content saved.');
          setTimeout(() => { button.textContent = 'Save'; }, 1600);
        } catch (error) { button.textContent = 'Failed'; message(error.message, true); setTimeout(() => { button.textContent = 'Save'; }, 1800); }
        finally { button.disabled = false; }
      });
      items.appendChild(card);
    });
  }

  async function loadContent() {
    const rows = await api('/api/admin/content');
    contentRows = Array.isArray(rows) ? rows : [];
    fieldCount.textContent = contentRows.length;
    renderContent(contentRows);
  }

  async function loadBranches() {
    const target = document.getElementById('branches');
    target.innerHTML = '<div class="admin-empty">Loading branches…</div>';
    try {
      const data = await api('/api/admin/maintenance?type=branches');
      repoStatus.textContent = 'Connected';
      const branches = data.branches || [];
      const select = document.getElementById('branch-from');
      select.innerHTML = '';
      branches.forEach(branch => { const o = document.createElement('option'); o.value = branch.name; o.textContent = branch.name; select.appendChild(o); });
      target.innerHTML = branches.map(b => `<div class="admin-list-row"><div><strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(b.sha || '')}</small></div><span class="admin-list-pill">BRANCH</span></div>`).join('') || '<div class="admin-empty">No branches returned.</div>';
    } catch (error) { repoStatus.textContent = 'Unavailable'; target.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`; }
  }

  async function createBranch() {
    const button = document.getElementById('create-branch');
    const name = document.getElementById('branch-name').value.trim();
    const from = document.getElementById('branch-from').value;
    if (!name) return message('Enter a branch name.', true);
    button.disabled = true; button.textContent = 'Creating…';
    try { await api('/api/admin/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create_branch', name, from }) }); message(`Branch ${name} created.`); document.getElementById('branch-name').value = ''; await loadBranches(); }
    catch (error) { message(error.message, true); }
    finally { button.disabled = false; button.textContent = 'Create Branch'; }
  }

  async function loadPulls() {
    const target = document.getElementById('pulls');
    target.innerHTML = '<div class="admin-empty">Loading approval requests…</div>';
    try {
      const data = await api('/api/admin/maintenance?type=pulls');
      repoStatus.textContent = 'Connected';
      const pulls = data.pulls || [];
      target.innerHTML = '';
      if (!pulls.length) { target.innerHTML = '<div class="admin-empty">No open pull requests.</div>'; return; }
      pulls.forEach(p => {
        const row = document.createElement('article'); row.className = 'admin-list-row pr-row';
        row.innerHTML = `<div><strong>#${p.number} · ${escapeHtml(p.title)}</strong><small>${escapeHtml(p.head || '')} → ${escapeHtml(p.base || '')} · ${escapeHtml(p.user || '')}</small></div><div class="admin-row-actions"><a class="admin-action" href="${escapeAttr(p.html_url)}" target="_blank" rel="noopener">Review ↗</a><button class="admin-save" type="button">Approve</button></div>`;
        row.querySelector('button').addEventListener('click', () => approvePull(p.number, row));
        target.appendChild(row);
      });
    } catch (error) { repoStatus.textContent = 'Unavailable'; target.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`; }
  }

  async function approvePull(number, row) {
    const button = row.querySelector('button'); button.disabled = true; button.textContent = 'Approving…';
    try { await api('/api/admin/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve_pr', number }) }); message(`Pull request #${number} approved.`); await loadPulls(); }
    catch (error) { message(error.message, true); button.disabled = false; button.textContent = 'Approve'; }
  }

  async function loadCompany() {
    const data = await api('/api/admin/company');
    const c = data.company || {};
    ['company_name','company_tagline','company_phone','company_email','company_address','company_logo_url'].forEach(id => { const el = document.getElementById(id); if (el) el.value = c[id] || ''; });
  }

  async function saveCompany(event) {
    event.preventDefault();
    const form = event.currentTarget; const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Saving identity…';
    try {
      const file = document.getElementById('company_logo').files[0];
      let logo;
      if (file) {
        if (file.size > 2 * 1024 * 1024) throw new Error('Logo must be 2 MB or smaller.');
        logo = { dataUrl: await fileToDataUrl(file) };
      }
      const body = { company_name: val('company_name'), company_tagline: val('company_tagline'), company_phone: val('company_phone'), company_email: val('company_email'), company_address: val('company_address'), company_logo_url: val('company_logo_url') };
      if (logo) body.logo = logo;
      await api('/api/admin/company', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      message('Company identity saved.'); document.getElementById('company_logo').value = '';
    } catch (error) { message(error.message, true); }
    finally { button.disabled = false; button.textContent = 'Save Company Identity'; }
  }

  function val(id) { return document.getElementById(id)?.value.trim() || ''; }
  function fileToDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Unable to read logo.')); reader.readAsDataURL(file); }); }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function escapeAttr(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }

  function friendlyError(error, context = 'This service') {
    const raw = String(error?.message || error || '');
    if (/502|github|token|repository/i.test(raw)) return context + ' is temporarily unavailable. The rest of the Admin Control Center is still available.';
    if (/401|session|authenticated/i.test(raw)) return 'Your secure admin session needs to be refreshed. Please sign in again.';
    if (/D1|database/i.test(raw)) return 'Website content storage is temporarily unavailable. Please try again shortly.';
    if (/network|fetch/i.test(raw)) return 'The service could not be reached. Please check your connection and try again.';
    return context + ' could not complete this request. Please try again.';
  }
  async function logout() { await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin', cache: 'no-store' }); window.location.href = '/admin/login.html'; }

  async function diagnostics() {
    const grid = document.getElementById('health-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="health-card pending"><span>…</span><div><strong>Running diagnostics</strong><small>Checking authenticated services.</small></div></div>';
    try {
      const d = await api('/api/admin/maintenance?type=overview');
      grid.innerHTML = '';
      const add = (name,state,detail) => {
        const ok = ['Connected','Protected','Available','Ready'].includes(state);
        const el = document.createElement('div');
        el.className = 'health-card ' + (ok ? 'ok' : 'bad');
        el.innerHTML = '<span>' + (ok ? '✓' : '!') + '</span><div><strong>' + escapeHtml(name) + '</strong><small>' + escapeHtml(detail || '') + '</small></div><b>' + escapeHtml(state || 'Unknown') + '</b>';
        grid.appendChild(el);
      };
      add('Admin Session','Protected','Signed HttpOnly session is active.');
      add('Cloudflare D1',d.d1?.status || 'Available',d.d1?.detail || 'Database binding checked.');
      add('GitHub Gateway',d.github?.status || 'Unavailable',d.github?.detail || 'Repository API check.');
      add('Production Branch',d.production_branch || 'main','Configured deployment branch.');
      document.getElementById('env-status').textContent = d.environment?.status || 'Ready';
      document.getElementById('env-detail').textContent = d.environment?.detail || 'Runtime bindings checked';
      document.getElementById('repository-name').textContent = d.repository || 'springnexaa-ops/C-Web';
      document.getElementById('production-branch').textContent = d.production_branch || 'main';
      document.getElementById('gateway-status').textContent = d.github?.status || 'Unavailable';
      document.getElementById('repo-detail').textContent = d.github?.detail || 'Repository maintenance gateway';
      document.getElementById('repository-sha').textContent = d.head_sha || 'Head SHA unavailable';
    } catch (error) {
      grid.innerHTML = '<div class="health-card bad"><span>!</span><div><strong>Diagnostics unavailable</strong><small>' + escapeHtml(error.message) + '</small></div><b>Attention</b></div>';
      document.getElementById('env-status').textContent = 'Attention';
      document.getElementById('env-detail').textContent = error.message;
    }
  }

  async function load() {
    try {
      await session();
      who.textContent = 'Admin · Active';
    } catch (error) {
      who.textContent = 'Session expired';
      message('Your secure admin session could not be verified. Please sign in again.', true);
      return;
    }

    const tasks = [
      ['Website content', loadContent],
      ['Branch management', loadBranches],
      ['Approval workflow', loadPulls],
      ['Company identity', loadCompany],
      ['Service diagnostics', diagnostics]
    ];

    for (const [label, task] of tasks) {
      try {
        await task();
      } catch (error) {
        message(label + ' is temporarily unavailable. Other admin features remain available.', true);
      }
    }
  }

  document.getElementById('search').addEventListener('input', () => renderContent(contentRows));
  document.getElementById('refresh').addEventListener('click', load);
  document.getElementById('run-health')?.addEventListener('click', diagnostics);
  document.getElementById('load-repo')?.addEventListener('click', diagnostics);
  document.getElementById('load-branches').addEventListener('click', loadBranches);
  document.getElementById('load-pulls').addEventListener('click', loadPulls);
  document.getElementById('create-branch').addEventListener('click', createBranch);
  document.getElementById('company-form').addEventListener('submit', saveCompany);
  document.getElementById('logout').addEventListener('click', logout);
  load();
})();
