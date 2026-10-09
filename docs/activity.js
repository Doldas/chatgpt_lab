/**
 * Public repository activity for chatgpt_lab.
 *
 * GitHub public REST API only; no token, proxy, analytics, or persistence.
 * This is a trace of repository changes and PRs, NOT a live feed of an
 * agent's private reasoning or actions that have not been committed.
 */
(() => {
  'use strict';

  const base = 'https://api.github.com/repos/Doldas/chatgpt_lab';
  const webBase = 'https://github.com/Doldas/chatgpt_lab';
  const prList = document.querySelector('#activity-prs');
  const commitsList = document.querySelector('#activity-commits');
  const status = document.querySelector('#activity-status');
  const button = document.querySelector('#activity-refresh');
  const updatedAt = document.querySelector('#activity-updated');
  if (!prList || !commitsList || !status || !button || !updatedAt) return;

  const textNode = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = String(value ?? '');
    if (className) node.className = className;
    return node;
  };

  const linked = (label, url) => {
    const node = textNode('a', label);
    node.href = url;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  };

  const dateString = iso => {
    if (typeof iso !== 'string') return 'Okänt datum';
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
      ? 'Okänt datum'
      : new Intl.DateTimeFormat('sv-SE', {
          dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Stockholm'
        }).format(date);
  };

  function isGitHubUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname === 'github.com' &&
        parsed.pathname.startsWith('/Doldas/chatgpt_lab/');
    } catch {
      return false;
    }
  }

  function activityRow(title, detail, url, state, number) {
    const row = document.createElement('li');
    row.className = 'activity-row';
    const body = document.createElement('div');
    body.className = 'activity-row-text';
    body.append(
      linked(title, isGitHubUrl(url) ? url : webBase + '/pulls'),
      textNode('span', detail, 'activity-row-meta')
    );
    row.append(body);
    if (state) row.append(textNode('span', state, 'activity-state'));
    return row;
  }

  async function getJSON(url) {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('GitHub API HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected GitHub API response');
    return data;
  }

  async function loadPulls() {
    const pulls = await getJSON(base + '/pulls?state=all&sort=updated&direction=desc&per_page=8');
    if (pulls.length === 0) {
      prList.replaceChildren(textNode('li', 'Ännu inga pull requests.', 'activity-empty'));
      return;
    }
    const items = pulls.map(pr => {
      const state = pr.merged_at ? 'Mergad' :
        pr.state === 'closed' ? 'Stängd' :
        pr.draft ? 'Utkast' : 'Öppen';
      return activityRow(
        '#' + pr.number + ' ' + (typeof pr.title === 'string' ? pr.title : 'Ändringsförslag'),
        (pr.user?.login || 'Okänd författare') + ' · Uppdaterad ' + dateString(pr.updated_at),
        pr.html_url, state
      );
    });
    prList.replaceChildren(...items);
  }

  async function loadCommits() {
    const commits = await getJSON(base + '/commits?per_page=8');
    if (commits.length === 0) {
      commitsList.replaceChildren(textNode('li', 'Ännu inga commits.', 'activity-empty'));
      return;
    }
    const items = commits.map(commit => {
      const sha = typeof commit.sha === 'string' ? commit.sha.slice(0, 7) : 'commit';
      const firstLine = (commit.commit?.message || '').split('\n')[0] || 'Ändring';
      const who = commit.author?.login || commit.commit?.author?.name || 'Okänd författare';
      return activityRow(
        firstLine,
        sha + ' · ' + who + ' · ' + dateString(commit.commit?.author?.date),
        commit.html_url,
        ''
      );
    });
    commitsList.replaceChildren(...items);
  }

  let busy = false;
  async function refresh() {
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.textContent = 'Hämtar synliga ändringar från GitHub …';
    const result = await Promise.allSettled([loadPulls(), loadCommits()]);
    const failed = result.filter(item => item.status === 'rejected');
    if (failed.length === 0) {
      status.textContent = 'Visar offentliga förslag och commits från GitHub.';
    } else {
      status.textContent = 'Vissa uppgifter kunde inte hämtas (GitHub kan begränsa anrop). Öppna repot direkt nedan.';
      if (result[0].status === 'rejected') {
        prList.replaceChildren(textNode('li', 'Pull requests kunde inte hämtas. Se GitHub-länken.', 'activity-empty'));
      }
      if (result[1].status === 'rejected') {
        commitsList.replaceChildren(textNode('li', 'Commits kunde inte hämtas. Se GitHub-länken.', 'activity-empty'));
      }
    }
    updatedAt.textContent = 'Senast kontrollerat ' + new Intl.DateTimeFormat('sv-SE', {
      timeStyle: 'short', timeZone: 'Europe/Stockholm'
    }).format(new Date()) + ' (svensk tid)';
    button.disabled = false;
    busy = false;
  }

  button.addEventListener('click', refresh);
  refresh();
})();
