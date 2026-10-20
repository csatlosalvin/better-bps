// ==========================================================================
// BPS Gellért Sötét Mód - Beállítások Logika (Popup JS)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const storageApi = (typeof browser !== 'undefined' && browser.storage && browser.storage.local)
    ? browser.storage.local
    : (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local ? chrome.storage.local : null);

  const tabsApi = (typeof browser !== 'undefined' && browser.tabs)
    ? browser.tabs
    : (typeof chrome !== 'undefined' && chrome.tabs ? chrome.tabs : null);

  // 20 Prémium téma
  const THEMES = [
    { id: 'digital-horizon', name: 'Digital Horizon', gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%)', tags: ['blue', 'pink', 'cyan'] },
    { id: 'blossom', name: 'Blossom', gradient: 'linear-gradient(135deg, #c7d2fe 0%, #7dd3fc 50%, #38bdf8 100%)', tags: ['cyan', 'blue'] },
    { id: 'bubblegum', name: 'Bubblegum', gradient: 'linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #818cf8 100%)', tags: ['pink', 'violet'] },
    { id: 'cherry', name: 'Cherry', gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fda4af 100%)', tags: ['red', 'pink'] },
    { id: 'coral', name: 'Coral', gradient: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 40%, #38bdf8 100%)', tags: ['orange', 'cyan'] },
    { id: 'express', name: 'Express', gradient: 'linear-gradient(135deg, #701a75 0%, #4a044e 50%, #2e1065 100%)', tags: ['violet', 'dark'] },
    { id: 'hyper', name: 'Hyper', gradient: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #3b82f6 100%)', tags: ['pink', 'blue', 'violet'] },
    { id: 'may', name: 'May', gradient: 'linear-gradient(135deg, #f0abfc 0%, #f472b6 50%, #fbcfe8 100%)', tags: ['pink'] },
    { id: 'pastel', name: 'Pastel', gradient: 'linear-gradient(135deg, #fecdd3 0%, #e9d5ff 50%, #c7d2fe 100%)', tags: ['pink', 'violet'] },
    { id: 'slate-indigo', name: 'Slate Indigo', gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #6366f1 100%)', tags: ['blue', 'dark'] },
    { id: 'midnight-oled', name: 'Midnight OLED', gradient: 'linear-gradient(135deg, #000000 0%, #18181b 50%, #06b6d4 100%)', tags: ['dark', 'cyan'] },
    { id: 'tokyo-night', name: 'Tokyo Night', gradient: 'linear-gradient(135deg, #1a1b26 0%, #24283b 50%, #7aa2f7 100%)', tags: ['blue', 'violet'] },
    { id: 'cyberpunk', name: 'Cyberpunk', gradient: 'linear-gradient(135deg, #ff007f 0%, #7928ca 50%, #00f0ff 100%)', tags: ['pink', 'cyan'] },
    { id: 'emerald-matrix', name: 'Emerald Matrix', gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)', tags: ['green'] },
    { id: 'amber-gold', name: 'Gellért Gold', gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)', tags: ['orange', 'yellow'] },
    { id: 'nord-frost', name: 'Nord Frost', gradient: 'linear-gradient(135deg, #2e3440 0%, #4c566a 50%, #88c0d0 100%)', tags: ['cyan', 'blue', 'dark'] },
    { id: 'dracula', name: 'Dracula', gradient: 'linear-gradient(135deg, #282a36 0%, #6272a4 50%, #bd93f9 100%)', tags: ['violet', 'pink', 'dark'] },
    { id: 'forest-moss', name: 'Forest Moss', gradient: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #84cc16 100%)', tags: ['darkgreen', 'green'] },
    { id: 'ocean-abyss', name: 'Ocean Abyss', gradient: 'linear-gradient(135deg, #022c43 0%, #0369a1 50%, #38bdf8 100%)', tags: ['blue', 'cyan'] },
    { id: 'sunset-vibes', name: 'Sunset Vibes', gradient: 'linear-gradient(135deg, #4c0519 0%, #f97316 50%, #a855f7 100%)', tags: ['orange', 'violet', 'red'] }
  ];

  // 10 Színszűrő gomb (2 sor)
  const FILTER_COLORS = [
    [
      { id: 'red', color: '#dc2626', title: 'Piros' },
      { id: 'orange', color: '#ea580c', title: 'Narancs' },
      { id: 'yellow', color: '#ca8a04', title: 'Sárga/Arany' },
      { id: 'green', color: '#16a34a', title: 'Világoszöld' },
      { id: 'darkgreen', color: '#14532d', title: 'Sötétzöld' }
    ],
    [
      { id: 'cyan', color: '#0891b2', title: 'Ciánkék' },
      { id: 'blue', color: '#2563eb', title: 'Kék' },
      { id: 'violet', color: '#7c3aed', title: 'Lila' },
      { id: 'pink', color: '#db2777', title: 'Rózsaszín' },
      { id: 'dark', color: '#374151', title: 'Sötét' }
    ]
  ];

  let currentTheme = 'digital-horizon';
  let themeActive = true;
  let activeFilter = null;

  // UI Elemek
  const themeToggle = document.getElementById('theme-toggle');
  const themeStatusText = document.getElementById('theme-status-text');
  const floatingBtnToggle = document.getElementById('floating-btn-toggle');
  const filterPillsContainer = document.getElementById('filter-pills-container');
  const themeGrid = document.getElementById('theme-grid');

  function notifyActiveTab(message) {
    if (!tabsApi) return;
    try {
      if (typeof browser !== 'undefined' && browser.tabs) {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          if (tabs && tabs[0] && tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, message).catch(() => {});
          }
        }).catch(() => {});
      } else {
        tabsApi.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].id && chrome.tabs && chrome.tabs.sendMessage) {
            chrome.tabs.sendMessage(tabs[0].id, message, () => {
              if (chrome.runtime.lastError) {}
            });
          }
        });
      }
    } catch (e) {}
  }

  function updateStatusDisplay(isEnabled) {
    if (isEnabled) {
      themeStatusText.textContent = 'Bekapcsolva';
      themeStatusText.classList.remove('disabled');
    } else {
      themeStatusText.textContent = 'Kikapcsolva';
      themeStatusText.classList.add('disabled');
    }
  }

  // Színszűrő felépítése
  function renderFilters() {
    filterPillsContainer.replaceChildren();
    FILTER_COLORS.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'filter-row';
      row.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-pill';
        if (activeFilter === item.id) btn.classList.add('active');
        btn.style.setProperty('--pill-color', item.color);
        btn.title = item.title;
        btn.addEventListener('click', () => {
          if (activeFilter === item.id) {
            activeFilter = null;
          } else {
            activeFilter = item.id;
          }
          renderFilters();
          filterThemeCards();
        });
        rowDiv.appendChild(btn);
      });
      filterPillsContainer.appendChild(rowDiv);
    });
  }

  // Téma kártyák felépítése
  function renderThemeCards() {
    themeGrid.replaceChildren();
    THEMES.forEach(t => {
      const isVisible = !activeFilter || t.tags.includes(activeFilter);
      const card = document.createElement('div');
      card.className = 'theme-card';
      if (themeActive && currentTheme === t.id) card.classList.add('active');
      if (!isVisible) card.style.display = 'none';
      card.dataset.themeId = t.id;
      card.dataset.tags = t.tags.join(',');

      const preview = document.createElement('div');
      preview.className = 'theme-card-preview';
      preview.style.setProperty('--theme-gradient', t.gradient);

      const label = document.createElement('div');
      label.className = 'theme-card-label';
      label.title = t.name;
      label.textContent = t.name;

      card.append(preview, label);

      card.addEventListener('click', () => {
        currentTheme = t.id;
        themeActive = currentTheme !== 'amber-gold';

        document.querySelectorAll('.theme-card').forEach(c => {
          c.classList.toggle('active', themeActive && c.dataset.themeId === currentTheme);
        });

        if (storageApi) {
          storageApi.set({
            bps_dark_theme_id: currentTheme,
            bps_theme_active: currentTheme !== 'amber-gold'
          });
        }

        notifyActiveTab({
          action: 'setTheme',
          themeId: currentTheme
        });
      });

      themeGrid.appendChild(card);
    });
  }

  function filterThemeCards() {
    const cards = themeGrid.querySelectorAll('.theme-card');
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      if (!activeFilter || tags.includes(activeFilter)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 1. Meglévő beállítások betöltése
  if (storageApi) {
    const applyStoredValues = (res) => {
      const isEnabled = res && typeof res.bps_dark_theme_enabled === 'boolean' ? res.bps_dark_theme_enabled : true;
      themeActive = res && typeof res.bps_theme_active === 'boolean' ? res.bps_theme_active : true;
      currentTheme = res && res.bps_dark_theme_id ? res.bps_dark_theme_id : 'digital-horizon';
      const showFloating = res && typeof res.bps_show_floating_button === 'boolean' ? res.bps_show_floating_button : true;

      themeToggle.checked = isEnabled;
      updateStatusDisplay(isEnabled);
      floatingBtnToggle.checked = showFloating;

      renderFilters();
      renderThemeCards();
    };

    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
      storageApi.get(['bps_dark_theme_enabled', 'bps_theme_active', 'bps_dark_theme_id', 'bps_show_floating_button'])
        .then(applyStoredValues)
        .catch(() => {
          renderFilters();
          renderThemeCards();
        });
    } else {
      storageApi.get(['bps_dark_theme_enabled', 'bps_theme_active', 'bps_dark_theme_id', 'bps_show_floating_button'], applyStoredValues);
    }
  } else {
    renderFilters();
    renderThemeCards();
  }

  // 2. Főkapcsoló
  themeToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    updateStatusDisplay(isEnabled);

    if (storageApi) {
      storageApi.set({ bps_dark_theme_enabled: isEnabled });
    }

    notifyActiveTab({
      action: 'toggleTheme',
      enabled: isEnabled
    });
  });

  // 3. Lebegő gomb ki/be
  floatingBtnToggle.addEventListener('change', (e) => {
    const show = e.target.checked;

    if (storageApi) {
      storageApi.set({ bps_show_floating_button: show });
    }

    notifyActiveTab({
      action: 'toggleFloatingButton',
      show: show
    });
  });
});
