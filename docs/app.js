(() => {
  'use strict';

  const searchInput = document.querySelector('#project-search');
  const listElement = document.querySelector('#project-list');
  const statusElement = document.querySelector('#catalog-status');
  const countElement = document.querySelector('#project-count');
  const copyButton = document.querySelector('#copy-prompt');
  const copyStatus = document.querySelector('#copy-status');
  const prompt = document.querySelector('#agent-prompt');
  let projects = [];
  const githubBase = 'https://github.com/Doldas/chatgpt_lab';

  function textElement(tag, content, className) {
    const el = document.createElement(tag);
    el.textContent = content;
    if (className) el.className = className;
    return el;
  }

  function linkElement(label, url) {
    const anchor = textElement('a', label);
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor;
  }

  function validatePath(path) {
    return typeof path === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
  }

  function validProject(p) {
    return p && typeof p === 'object' &&
      ['id', 'title', 'subtitle', 'description', 'path', 'language',
       'kind', 'status', 'howToRun'].every(k => typeof p[k] === 'string') &&
      validatePath(p.path) && validatePath(p.id) &&
      typeof p.hasLiveDemo === 'boolean';
  }

  function cardFor(p, index) {
    const card = document.createElement('article');
    card.className = 'project-card';
    const head = textElement('div', '', 'project-card-head');
    head.append(
      textElement('span', String(index + 1).padStart(3, '0') + ' / EXPERIMENT', 'project-number'),
      textElement('span', p.status, 'project-badge')
    );
    card.append(
      head,
      textElement('h3', p.title),
      textElement('p', p.subtitle, 'project-subtitle'),
      textElement('p', p.description, 'project-description')
    );
    const meta = textElement('div', '', 'project-meta');
    meta.append(
      textElement('span', p.language),
      textElement('span', p.kind)
    );
    card.append(meta, textElement('p', 'Kör: ' + p.howToRun, 'project-run'));
    const links = textElement('div', '', 'project-links');
    const path = encodeURIComponent(p.path);
    links.append(
      linkElement('Öppna projektet ↗', githubBase + '/tree/master/' + path),
      linkElement('Läs README ↗', githubBase + '/blob/master/' + path + '/README.md'),
      linkElement('Agentinstruktioner ↗', githubBase + '/blob/master/' + path + '/AGENTS.md')
    );
    if (p.hasLiveDemo && typeof p.liveUrl === 'string' && /^https:\/\//i.test(p.liveUrl)) {
      links.append(linkElement('Kör live ↗', p.liveUrl));
    }
    card.append(links);
    return card;
  }

  function render() {
    const query = searchInput.value.trim().toLocaleLowerCase('sv');
    const filtered = projects.filter(p => [
      p.title, p.subtitle, p.description, p.language, p.kind, p.status
    ].some(value => value.toLocaleLowerCase('sv').includes(query)));
    const fragment = document.createDocumentFragment();
    if (filtered.length === 0) {
      fragment.append(textElement('p',
        'Inga experiment matchade din sökning. Prova något annat.',
        'no-results'));
    } else {
      for (const p of filtered) {
        fragment.append(cardFor(p, projects.indexOf(p)));
      }
    }
    listElement.replaceChildren(fragment);
    statusElement.textContent = query
      ? filtered.length + ' av ' + projects.length + ' experiment matchar sökningen.'
      : 'Visar ' + projects.length + ' experiment.';
  }

  async function loadCatalog() {
    try {
      const response = await fetch('./projects.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const catalog = await response.json();
      if (catalog.schemaVersion !== 1 ||
          catalog.repository !== 'Doldas/chatgpt_lab' ||
          !Array.isArray(catalog.projects) ||
          !catalog.projects.every(validProject)) {
        throw new Error('Okänt katalogformat');
      }
      const ids = new Set(catalog.projects.map(p => p.id));
      const paths = new Set(catalog.projects.map(p => p.path));
      if (ids.size !== catalog.projects.length || paths.size !== catalog.projects.length) {
        throw new Error('Duplicerade projekt-id eller sökvägar');
      }
      projects = catalog.projects;
      countElement.textContent = String(projects.length);
      render();
    } catch (error) {
      console.error('Kunde inte läsa projektkatalogen:', error);
      countElement.textContent = '?';
      statusElement.textContent =
        'Projektkatalogen kunde inte laddas. Kontrollera att projects.json finns och kör webbplatsen via HTTP, inte file://.';
      listElement.replaceChildren(
        textElement('p', 'Se projektens README-filer direkt på GitHub så länge.', 'no-results')
      );
    }
  }

  searchInput.addEventListener('input', render);
  document.addEventListener('keydown', event => {
    if (event.key === '/' &&
        !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) &&
        !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
    }
  });
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prompt.value);
      copyStatus.textContent = 'Kopierat!';
    } catch {
      prompt.focus();
      prompt.select();
      copyStatus.textContent = 'Markera och kopiera med Ctrl/Cmd+C.';
    }
  });
  loadCatalog();
})();
