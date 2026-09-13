(() => {
  const items = document.getElementById('items');
  const status = document.getElementById('status');
  const who = document.getElementById('who');

  async function session() {
    const response = await fetch('/api/admin/session', { credentials: 'same-origin' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.loggedIn) {
      window.location.href = '/admin/login.html';
      return false;
    }
    who.textContent = data.username;
    return true;
  }

  async function load() {
    if (!(await session())) return;
    const response = await fetch('/api/admin/content', { credentials: 'same-origin' });
    const rows = await response.json().catch(() => []);
    items.innerHTML = '';
    if (!response.ok || !Array.isArray(rows) || !rows.length) {
      items.innerHTML = '<div class="admin-empty">No editable D1 content is available.</div>';
      return;
    }
    rows.forEach(row => {
      const card = document.createElement('article');
      card.className = 'admin-item';
      card.innerHTML = '<div class="admin-item-head"><span class="admin-key"></span><span class="admin-time"></span></div><textarea maxlength="10000"></textarea><div class="admin-item-foot"><button class="admin-save" type="button">Save</button></div>';
      card.querySelector('.admin-key').textContent = row.key;
      card.querySelector('.admin-time').textContent = row.updated_at || '';
      card.querySelector('textarea').value = row.value || '';
      const button = card.querySelector('button');
      button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = 'Saving…';
        try {
          const save = await fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ key: row.key, value: card.querySelector('textarea').value })
          });
          if (!save.ok) throw new Error('Save failed');
          button.textContent = 'Saved ✓';
          status.textContent = 'D1 content saved successfully.';
          setTimeout(() => { button.textContent = 'Save'; status.textContent = ''; }, 1800);
        } catch (error) {
          button.textContent = 'Failed';
          status.textContent = error.message;
          setTimeout(() => { button.textContent = 'Save'; status.textContent = ''; }, 2200);
        } finally { button.disabled = false; }
      });
      items.appendChild(card);
    });
  }

  load();
})();
