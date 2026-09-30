import { getAdmin, json } from '../../_lib/admin-auth.js';

const OWNER = 'springnexaa-ops';
const REPO = 'C-Web';

async function requireAdmin(request, env) {
  return getAdmin(request, env);
}

function githubConfig(env) {
  return {
    token: String(env.GITHUB_TOKEN || ''),
    owner: String(env.GITHUB_OWNER || OWNER),
    repo: String(env.GITHUB_REPO || REPO)
  };
}

async function github(env, path, init = {}) {
  const cfg = githubConfig(env);
  if (!cfg.token) throw new Error('GITHUB_TOKEN is not configured in Cloudflare.');
  const response = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cfg.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'SpringNexa-Admin-Console',
      ...(init.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `GitHub request failed (${response.status}).`);
  return data;
}

export async function onRequestGet({ request, env }) {
  if (!(await requireAdmin(request, env))) return json({ error: 'Not authenticated.' }, 401);
  const cfg = githubConfig(env);
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'overview';
  try {
    if (type === 'overview') {
      let d1 = { status: 'Unavailable', detail: 'D1 binding is not available.' };
      try {
        if (env.DB) {
          await env.DB.prepare('SELECT 1 AS ok').first();
          d1 = { status: 'Available', detail: 'Cloudflare D1 database responded.' };
        }
      } catch (error) {
        d1 = { status: 'Unavailable', detail: error.message };
      }
      let githubState = { status: 'Unavailable', detail: 'GitHub gateway unavailable.' };
      let headSha = null;
      try {
        const repo = await github(env, '');
        headSha = repo.default_branch ? (await github(env, '/git/ref/heads/' + encodeURIComponent(repo.default_branch))).object?.sha : null;
        githubState = { status: 'Connected', detail: repo.full_name + ' · ' + (repo.default_branch || 'main') };
      } catch (error) {
        githubState = { status: 'Unavailable', detail: error.message };
      }
      return json({
        ok: true,
        repository: cfg.owner + '/' + cfg.repo,
        production_branch: String(env.CLOUDFLARE_PRODUCTION_BRANCH || 'main'),
        head_sha: headSha,
        d1,
        github: githubState,
        environment: {
          status: env.DB && env.ADMIN_TOKEN ? 'Ready' : 'Attention',
          detail: [env.DB ? 'D1' : 'D1 missing', env.ADMIN_TOKEN ? 'ADMIN_TOKEN' : 'ADMIN_TOKEN missing', env.GITHUB_TOKEN ? 'GitHub token' : 'GitHub token missing'].join(' · ')
        }
      });
    }
    if (type === 'branches') {
      const branches = await github(env, '/branches?per_page=100');
      return json({ ok: true, type, repository: `${cfg.owner}/${cfg.repo}`, branches: branches.map(b => ({ name: b.name, sha: b.commit?.sha })) });
    }
    if (type === 'pulls') {
      const pulls = await github(env, '/pulls?state=open&per_page=50&sort=updated&direction=desc');
      return json({ ok: true, type, repository: `${cfg.owner}/${cfg.repo}`, pulls: pulls.map(p => ({ number: p.number, title: p.title, user: p.user?.login, head: p.head?.ref, base: p.base?.ref, draft: !!p.draft, updated_at: p.updated_at, html_url: p.html_url })) });
    }
    return json({ ok: true, repository: `${cfg.owner}/${cfg.repo}`, capabilities: ['branches:list', 'branches:create', 'pull_requests:list', 'pull_requests:approve', 'company:update', 'logo:update'] });
  } catch (error) {
    return json({ error: error.message }, 502);
  }
}

export async function onRequestPost({ request, env }) {
  if (!(await requireAdmin(request, env))) return json({ error: 'Not authenticated.' }, 401);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || '');
  const cfg = githubConfig(env);
  try {
    if (action === 'create_branch') {
      const name = String(body.name || '').trim();
      const from = String(body.from || 'main').trim();
      if (!/^[A-Za-z0-9._\/-]{1,100}$/.test(name) || name.includes('..') || name.startsWith('/') || name.endsWith('/')) return json({ error: 'Invalid branch name.' }, 400);
      if (!/^[A-Za-z0-9._\/-]{1,100}$/.test(from)) return json({ error: 'Invalid source branch.' }, 400);
      const source = await github(env, `/git/ref/heads/${encodeURIComponent(from)}`);
      await github(env, '/git/refs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: `refs/heads/${name}`, sha: source.object.sha }) });
      return json({ ok: true, message: `Branch ${name} created from ${from}.`, branch: name, sha: source.object.sha });
    }
    if (action === 'approve_pr') {
      const number = Number(body.number);
      if (!Number.isInteger(number) || number < 1) return json({ error: 'Invalid pull request number.' }, 400);
      const review = await github(env, `/pulls/${number}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: 'Approved from the SpringNexa secure Admin Console.', event: 'APPROVE' }) });
      return json({ ok: true, message: `Pull request #${number} approved.`, review_id: review.id });
    }
    return json({ error: 'Unknown maintenance action.' }, 400);
  } catch (error) {
    return json({ error: error.message }, 502);
  }
}
