// ==========================================================================
// BPS Gellért Sötét Mód & Témagaléria - Content Script (Optimized & Lag-Free)
// ==========================================================================

(function () {
  'use strict';

  // Storage API felderítése
  const storageApi = (typeof browser !== 'undefined' && browser.storage && browser.storage.local) 
    ? browser.storage.local 
    : (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local ? chrome.storage.local : null);

  // 20 Prémium téma definíciója
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

  // Színszűrő gombok
  const FILTER_COLORS = [
    [
      { id: 'red', color: '#dc2626', title: 'Piros' },
      { id: 'orange', color: '#ea580c', title: 'Narancs' },
      { id: 'yellow', color: '#ca8a04', title: 'Sárga/Arany' },
      { id: 'green', color: '#16a34a', title: 'Világoszöld' },
      { id: 'darkgreen', color: '#14532d', title: 'Sötétzöld' }
    ],
    [
      { id: 'cyan', color: '#0891b2', title: 'Ciánkék/Türkiz' },
      { id: 'blue', color: '#2563eb', title: 'Kék' },
      { id: 'violet', color: '#7c3aed', title: 'Lila' },
      { id: 'pink', color: '#db2777', title: 'Rózsaszín' },
      { id: 'dark', color: '#374151', title: 'Sötét/Szürke' }
    ]
  ];

  const DEFAULT_PRANKER_COUNTS = {
    exclamation: 8,
    minus: 0,
    plus: 3
  };

  const PRANKER_LABELS = {
    exclamation: 'felkialto',
    minus: 'minusz',
    plus: 'plusz'
  };

  const DEFAULT_SETTINGS_TAB_VISIBILITY = {
    themes: true,
    preferences: true,
    pranker: true
  };

  const FONT_FAMILY_OPTIONS = {
    default: null,
    inter: 'Inter, "Segoe UI", sans-serif',
    poppins: 'Poppins, "Segoe UI", sans-serif',
    space: '"Space Grotesk", "Segoe UI", sans-serif',
    arial: 'Arial, Helvetica, sans-serif',
    georgia: 'Georgia, "Times New Roman", serif',
    mono: '"JetBrains Mono", Consolas, monospace'
  };

  const FONT_FAMILY_LABELS = {
    default: 'Alapértelmezett',
    inter: 'Inter',
    poppins: 'Poppins',
    space: 'Space Grotesk',
    arial: 'Arial',
    georgia: 'Georgia',
    mono: 'Monospace'
  };

  function sanitizeFontFamily(value) {
    return Object.prototype.hasOwnProperty.call(FONT_FAMILY_OPTIONS, value)
      ? value
      : 'default';
  }

  function sanitizeSettingsTabVisibility(value) {
    return {
      themes: value?.themes !== false,
      preferences: value?.preferences !== false,
      pranker: value?.pranker !== false
    };
  }

  function sanitizePrankerCount(value, fallback = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(999999, Math.round(number)));
  }

  function sanitizePrankerCounts(value) {
    return {
      exclamation: sanitizePrankerCount(value?.exclamation, DEFAULT_PRANKER_COUNTS.exclamation),
      minus: sanitizePrankerCount(value?.minus, DEFAULT_PRANKER_COUNTS.minus),
      plus: sanitizePrankerCount(value?.plus, DEFAULT_PRANKER_COUNTS.plus)
    };
  }

  function normalizePrankerText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  let state = {
    enabled: true,
    themeActive: true,
    theme: 'digital-horizon',
    showFloatingButton: true,
    enableAnimations: false,
    animationStyle: 'subtle',
    fontFamily: 'default',
    performanceMode: false,
    debugMode: false,
    activeFilter: null,
    prankerCounts: { ...DEFAULT_PRANKER_COUNTS },
    prankerActive: false,
    settingsTabVisibility: { ...DEFAULT_SETTINGS_TAB_VISIBILITY }
  };

  const originalPrankerValues = new WeakMap();

  // 1. Szinkron betöltés
  try {
    const cachedEnabled = localStorage.getItem('bps_dark_theme_enabled');
    const cachedThemeActive = localStorage.getItem('bps_theme_active');
    const cachedTheme = localStorage.getItem('bps_dark_theme_id');
    const cachedButton = localStorage.getItem('bps_show_floating_button');
    const cachedAnimations = localStorage.getItem('bps_enable_animations');
    const cachedAnimationStyle = localStorage.getItem('bps_animation_style');
    const cachedFontFamily = localStorage.getItem('bps_font_family');
    const cachedPerformance = localStorage.getItem('bps_performance_mode');
    const cachedDebug = localStorage.getItem('bps_debug_mode');
    const cachedPrankerCounts = localStorage.getItem('bps_pranker_counts');
    const cachedPrankerActive = localStorage.getItem('bps_pranker_active');
    const cachedSettingsTabVisibility = localStorage.getItem('bps_settings_tab_visibility');

    if (cachedEnabled !== null) {
      state.enabled = cachedEnabled === 'true';
    }
    if (cachedThemeActive !== null) {
      state.themeActive = cachedThemeActive === 'true';
    }
    if (cachedTheme) {
      state.theme = cachedTheme;
    }
    if (cachedButton !== null) {
      state.showFloatingButton = cachedButton === 'true';
    }
    if (cachedAnimations !== null) {
      state.enableAnimations = cachedAnimations === 'true';
    }
    if (cachedAnimationStyle) {
      state.animationStyle = cachedAnimationStyle;
    }
    if (cachedFontFamily) {
      state.fontFamily = sanitizeFontFamily(cachedFontFamily);
    }
    if (cachedPerformance !== null) {
      state.performanceMode = cachedPerformance === 'true';
    }
    if (cachedDebug !== null) {
      state.debugMode = cachedDebug === 'true';
    }
    if (cachedPrankerCounts) {
      state.prankerCounts = sanitizePrankerCounts(JSON.parse(cachedPrankerCounts));
      state.prankerActive = cachedPrankerActive === null || cachedPrankerActive === 'true';
    }
    if (cachedSettingsTabVisibility) {
      state.settingsTabVisibility = sanitizeSettingsTabVisibility(JSON.parse(cachedSettingsTabVisibility));
    }
  } catch (e) {}

  function applyAnimationStyleClass() {
    const root = document.documentElement;
    const styleClasses = [
      'bps-animation-style-subtle',
      'bps-animation-style-strong',
      'bps-animation-style-neon',
      'bps-animation-style-bounce',
      'bps-animation-style-minimal'
    ];
    root.classList.remove(...styleClasses);
    const validStyles = ['subtle', 'strong', 'neon', 'bounce', 'minimal'];
    const style = validStyles.includes(state.animationStyle) ? state.animationStyle : 'subtle';
    state.animationStyle = style;
    root.classList.add(`bps-animation-style-${style}`);
  }

  function applyFontFamily() {
    const root = document.documentElement;
    if (!root) return;

    state.fontFamily = sanitizeFontFamily(state.fontFamily);
    if (state.fontFamily === 'default') {
      root.removeAttribute('data-bps-font');
    } else {
      root.setAttribute('data-bps-font', state.fontFamily);
    }
  }

  function applyThemeClasses() {
    const root = document.documentElement;
    if (!root) return;
    applyAnimationStyleClass();
    applyFontFamily();

    // Gellért Gold is the native Base44 default/reset option, not an extension palette.
    if (state.theme === 'amber-gold') {
      state.themeActive = false;
    }

    if (!state.themeActive) {
      root.classList.remove('bps-theme-active', 'bps-dark-mode', 'bps-light-mode');
      root.classList.toggle('dark', state.enabled);
      root.classList.toggle('bps-no-animations', !state.enableAnimations || state.performanceMode);
      root.classList.toggle('bps-performance-mode', state.performanceMode);
      root.removeAttribute('data-bps-theme');
      syncSidebarItemDisplay();
      return;
    }

    const desiredModeClass = state.enabled ? 'bps-dark-mode' : 'bps-light-mode';
    const unwantedModeClass = state.enabled ? 'bps-light-mode' : 'bps-dark-mode';

    root.classList.add('bps-theme-active');
    root.setAttribute('data-bps-theme', state.theme);
    root.classList.add(desiredModeClass);
    root.classList.remove(unwantedModeClass);

    if (state.enabled) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.classList.toggle('bps-no-animations', !state.enableAnimations || state.performanceMode);
    root.classList.toggle('bps-performance-mode', state.performanceMode);

    syncSidebarItemDisplay();
  }

  function syncDigiPageNativeCards() {
    const root = document.documentElement;
    const pageText = document.body ? document.body.textContent.toLowerCase() : '';
    const isDigiPage = pageText.includes('digi osztály') && pageText.includes('kurzus keresése');
    root.classList.toggle('bps-digi-page', isDigiPage);

    document.querySelectorAll('.bps-native-digi-card').forEach((card) => {
      card.classList.remove('bps-native-digi-card');
    });
    if (!isDigiPage) return;

    document.querySelectorAll('[class*="rounded"]').forEach((element) => {
      const text = element.textContent.toLowerCase();
      if (text.includes('tanár:') && text.length < 500) {
        element.classList.add('bps-native-digi-card');
      }
    });
  }

  function findPrankerCounterTextNode(label) {
    const wantedLabel = PRANKER_LABELS[label];
    if (!document.body || !wantedLabel) return null;

    const labelNode = Array.from(document.body.querySelectorAll('*')).find((element) => {
      return element.children.length === 0
        && normalizePrankerText(element.textContent) === wantedLabel;
    });
    if (!labelNode) return null;

    let container = labelNode.parentElement;
    for (let depth = 0; container && depth < 7; depth += 1, container = container.parentElement) {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const numericNodes = [];
      let textNode;
      while ((textNode = walker.nextNode())) {
        if (/^\d+$/.test(textNode.nodeValue.trim())) {
          numericNodes.push(textNode);
        }
      }

      if (numericNodes.length === 1) {
        return numericNodes[0];
      }
    }

    return null;
  }

  function applyPrankerCounts() {
    Object.keys(PRANKER_LABELS).forEach((label) => {
      const textNode = findPrankerCounterTextNode(label);
      if (!textNode) return;

      if (!originalPrankerValues.has(textNode)) {
        const actualValue = textNode.nodeValue.trim();
        if (/^\d+$/.test(actualValue)) {
          originalPrankerValues.set(textNode, actualValue);
        }
      }

      if (state.prankerActive) {
        textNode.nodeValue = String(state.prankerCounts[label]);
      } else if (originalPrankerValues.has(textNode)) {
        textNode.nodeValue = originalPrankerValues.get(textNode);
      }
    });
  }

  function getActualPrankerCounts() {
    const actualCounts = { ...state.prankerCounts };

    Object.keys(PRANKER_LABELS).forEach((label) => {
      const textNode = findPrankerCounterTextNode(label);
      if (!textNode) return;

      const actualValue = originalPrankerValues.get(textNode) || textNode.nodeValue.trim();
      actualCounts[label] = sanitizePrankerCount(actualValue, actualCounts[label]);
    });

    return sanitizePrankerCounts(actualCounts);
  }

  function setPrankerCount(label, value) {
    if (!Object.prototype.hasOwnProperty.call(PRANKER_LABELS, label)) return;

    if (!state.prankerActive) {
      state.prankerCounts = getActualPrankerCounts();
    }
    state.prankerCounts[label] = sanitizePrankerCount(value, state.prankerCounts[label]);
    state.prankerActive = true;
    applyPrankerCounts();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_pranker_counts', JSON.stringify(state.prankerCounts));
      localStorage.setItem('bps_pranker_active', 'true');
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_pranker_counts: state.prankerCounts, bps_pranker_active: true });
    }
  }

  function resetPrankerCounts() {
    state.prankerCounts = getActualPrankerCounts();
    state.prankerActive = false;
    applyPrankerCounts();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_pranker_counts', JSON.stringify(state.prankerCounts));
      localStorage.setItem('bps_pranker_active', 'false');
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_pranker_counts: state.prankerCounts, bps_pranker_active: false });
    }
  }

  // Azonnali végrehajtás
  applyThemeClasses();

  // 2. Beállítások aszinkron betöltése a storage API-ból
  if (storageApi) {
    function applyStoredSettings(res) {
      if (res) {
        if (typeof res.bps_dark_theme_enabled === 'boolean') {
          state.enabled = res.bps_dark_theme_enabled;
        }
        if (typeof res.bps_theme_active === 'boolean') {
          state.themeActive = res.bps_theme_active;
        }
        if (res.bps_dark_theme_id) {
          state.theme = res.bps_dark_theme_id;
        }
        if (typeof res.bps_show_floating_button === 'boolean') {
          state.showFloatingButton = res.bps_show_floating_button;
        }
        if (typeof res.bps_enable_animations === 'boolean') {
          state.enableAnimations = res.bps_enable_animations;
        }
        if (typeof res.bps_animation_style === 'string') {
          state.animationStyle = res.bps_animation_style;
        }
        if (typeof res.bps_font_family === 'string') {
          state.fontFamily = sanitizeFontFamily(res.bps_font_family);
        }
        if (typeof res.bps_performance_mode === 'boolean') {
          state.performanceMode = res.bps_performance_mode;
        }
        if (typeof res.bps_debug_mode === 'boolean') {
          state.debugMode = res.bps_debug_mode;
        }
        if (res.bps_pranker_counts && typeof res.bps_pranker_counts === 'object') {
          state.prankerCounts = sanitizePrankerCounts(res.bps_pranker_counts);
          state.prankerActive = typeof res.bps_pranker_active === 'boolean'
            ? res.bps_pranker_active
            : true;
        }
        if (res.bps_settings_tab_visibility && typeof res.bps_settings_tab_visibility === 'object') {
          state.settingsTabVisibility = sanitizeSettingsTabVisibility(res.bps_settings_tab_visibility);
        }
        if (state.theme === 'amber-gold') {
          state.themeActive = false;
        }

        try {
          localStorage.setItem('bps_dark_theme_enabled', String(state.enabled));
          localStorage.setItem('bps_theme_active', String(state.themeActive));
          localStorage.setItem('bps_dark_theme_id', state.theme);
          localStorage.setItem('bps_show_floating_button', String(state.showFloatingButton));
          localStorage.setItem('bps_enable_animations', String(state.enableAnimations));
          localStorage.setItem('bps_animation_style', state.animationStyle);
          localStorage.setItem('bps_font_family', state.fontFamily);
          localStorage.setItem('bps_performance_mode', String(state.performanceMode));
          localStorage.setItem('bps_debug_mode', String(state.debugMode));
          localStorage.setItem('bps_pranker_counts', JSON.stringify(state.prankerCounts));
          localStorage.setItem('bps_pranker_active', String(state.prankerActive));
          localStorage.setItem('bps_settings_tab_visibility', JSON.stringify(state.settingsTabVisibility));
        } catch (err) {}

        applyThemeClasses();
        updateFloatingButtonUI();
        updateDropdownUI();
        applySettingsTabVisibility();
        applyPrankerCounts();
      }
    }

    const storageKeys = ['bps_dark_theme_enabled', 'bps_theme_active', 'bps_dark_theme_id', 'bps_show_floating_button', 'bps_enable_animations', 'bps_animation_style', 'bps_font_family', 'bps_performance_mode', 'bps_debug_mode', 'bps_pranker_counts', 'bps_pranker_active', 'bps_settings_tab_visibility'];
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
      storageApi.get(storageKeys).then(applyStoredSettings).catch((error) => {
        console.warn('[BPS theme] A beállítások betöltése sikertelen:', error);
      });
    } else {
      storageApi.get(storageKeys, applyStoredSettings);
    }

    if (storageApi.onChanged && storageApi.onChanged.addListener) {
      storageApi.onChanged.addListener((changes) => {
        const change = changes.bps_pranker_counts;
        if (change && change.newValue) {
          state.prankerCounts = sanitizePrankerCounts(change.newValue);
        }
        if (changes.bps_pranker_active && typeof changes.bps_pranker_active.newValue === 'boolean') {
          state.prankerActive = changes.bps_pranker_active.newValue;
        }
        if (changes.bps_settings_tab_visibility && changes.bps_settings_tab_visibility.newValue) {
          state.settingsTabVisibility = sanitizeSettingsTabVisibility(changes.bps_settings_tab_visibility.newValue);
          applySettingsTabVisibility();
          updateDropdownUI();
        }
        if (changes.bps_font_family && typeof changes.bps_font_family.newValue === 'string') {
          state.fontFamily = sanitizeFontFamily(changes.bps_font_family.newValue);
          applyFontFamily();
          updateDropdownUI();
        }
        if (change || changes.bps_pranker_active) {
          applyPrankerCounts();
          updateDropdownUI();
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. Oldalsáv Natív Gomb Szinkronizációja (Kétirányú, Végtelen Ciklus Nélkül)
  // --------------------------------------------------------------------------
  function findSidebarThemeToggle() {
    const candidates = document.querySelectorAll('aside button, aside a, aside [role="button"], nav button, nav a, nav [role="button"]');
    for (const el of candidates) {
      const text = el.textContent.trim().toLowerCase();
      if ((text.includes('sötét') || text.includes('világos')) && text.includes('mód')) {
        return el.closest('button, a, [role="button"]') || el;
      }
    }
    return null;
  }

  function syncSidebarItemDisplay() {
    const item = findSidebarThemeToggle();
    if (!item) return;

    const desiredMode = state.enabled ? 'dark' : 'light';
    // Ha már a kívánt állapotban van, semmit nem módosítunk a DOM-ban!
    if (item.dataset.bpsSyncState === desiredMode) return;
    item.dataset.bpsSyncState = desiredMode;

    // Szöveg frissítése – az aktuális állapotot mutatjuk (Hold = sötét, Nap = világos)
    const nextModeText = state.enabled ? 'Világos mód' : 'Sötét mód';

    const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      const val = node.nodeValue.toLowerCase();
      if (val.includes('sötét') || val.includes('világos')) {
        node.nodeValue = ' ' + nextModeText;
      }
    }

    // SVG frissítése – az aktuális állapotot tükrözi
    // Hold ikon = sötét mód aktív | Nap ikon = világos mód aktív
    const svg = item.querySelector('svg');
    if (svg) {
      const iconParts = state.enabled
        ? [
          ['circle', { cx: '12', cy: '12', r: '4' }],
          ['path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l1.41 1.41' }]
        ]
        : [['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }]];
      svg.replaceChildren(...iconParts.map(([tagName, attributes]) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
        return element;
      }));
    }
  }

  function attachSidebarItemListener() {
    const item = findSidebarThemeToggle();
    if (!item || item.dataset.bpsBound === 'true') return;
    item.dataset.bpsBound = 'true';

    item.addEventListener('click', (event) => {
      // The Base44 button has its own React handler. Prevent it from toggling
      // a second time after the extension changes the theme.
      event.preventDefault();
      event.stopPropagation();
      toggleTheme(!state.enabled);
    }, true);
  }

  function findDigiClassTab() {
    const candidates = document.querySelectorAll(
      'a, button, [role="link"], [role="button"], ' +
      '[data-testid*="digi" i], [aria-label*="digi" i], [title*="digi" i]'
    );
    for (const candidate of candidates) {
      const text = [
        candidate.textContent.trim(),
        candidate.getAttribute('aria-label'),
        candidate.getAttribute('title'),
        candidate.getAttribute('href'),
        candidate.getAttribute('data-testid')
      ].filter(Boolean).join(' ').toLowerCase();
      if (text.includes('digi osztály') || text.includes('digi osztaly') || text.includes('digi-class')) {
        const clickable = candidate.closest('a, button, [role="link"], [role="button"]');
        return clickable || candidate;
      }
    }
    return null;
  }

  function syncDigiClassAnimation() {
    document.querySelectorAll('.bps-digi-class-clicked').forEach((element) => {
      element.classList.remove('bps-digi-class-clicked');
    });

    const tab = findDigiClassTab();
    if (tab) {
      tab.classList.remove('bps-digi-class-clicked');
    }
  }

  function getDigiClassTabFromNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node.closest('a, button, [role="link"], [role="button"]');
    if (!element) return null;

    const text = [
      element.textContent.trim(),
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
      element.getAttribute('href'),
      element.getAttribute('data-testid')
    ].filter(Boolean).join(' ').toLowerCase();

    return text.includes('digi osztály')
      || text.includes('digi osztaly')
      || text.includes('digi-class')
      ? element
      : null;
  }

  document.addEventListener('click', (event) => {
    const tab = getDigiClassTabFromNode(event.target);
    if (!tab) return;

    tab.classList.remove('bps-digi-class-clicked');
    void tab.offsetWidth;
    tab.classList.add('bps-digi-class-clicked');

    if (tab._bpsDigiAnimationTimer) {
      clearTimeout(tab._bpsDigiAnimationTimer);
    }
    tab._bpsDigiAnimationTimer = setTimeout(() => {
      tab.classList.remove('bps-digi-class-clicked');
      tab._bpsDigiAnimationTimer = null;
    }, 2000);
  }, true);

  function getSidebarNavigationTarget(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;
    const clickableSelector = 'a, button, [role="button"], [class*="cursor-pointer"]';
    let candidate = node;

    // Walk from the actual event target upwards. This avoids selecting one
    // large sidebar wrapper that contains every navigation icon.
    for (let depth = 0; candidate && depth < 8; depth += 1, candidate = candidate.parentElement) {
      if (!candidate.matches(clickableSelector) || !isSidebarAnimationItem(candidate)) continue;

      let parent = candidate.parentElement;
      for (let parentDepth = 0; parent && parentDepth < 6; parentDepth += 1, parent = parent.parentElement) {
        const parentInfo = `${parent.tagName} ${parent.id || ''} ${parent.className || ''}`.toLowerCase();
        if (
          parent.tagName === 'ASIDE' ||
          parent.tagName === 'NAV' ||
          parentInfo.includes('sidebar') ||
          parentInfo.includes('side-bar')
        ) {
          return candidate;
        }
      }
    }

    return null;
  }

  const knownSidebarItems = [
    'műszerfal',
    'digi osztály',
    'digi osztaly',
    'órarend',
    'éves naptár',
    'modul/műhely/ws',
    'nyeremények',
    'üzenőfal'
  ];

  function isSidebarAnimationItem(item) {
    if (!item || item.nodeType !== Node.ELEMENT_NODE) return false;

    const themeToggle = findSidebarThemeToggle();
    if (
      themeToggle
      && (item === themeToggle || themeToggle.contains(item) || item.contains(themeToggle))
    ) {
      return false;
    }

    const normalizedText = item.textContent.trim().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalizedText.length > 80) return false;

    if (
      (normalizedText.includes('sotet') || normalizedText.includes('vilagos'))
      && normalizedText.includes('mod')
    ) {
      return false;
    }

    return knownSidebarItems.some((label) => normalizedText.includes(
      label.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    ));
  }

  function clearSidebarAnimationTargets(keepItem = null) {
    document.querySelectorAll('.bps-sidebar-animated').forEach((item) => {
      if (item === keepItem) return;
      item.classList.remove('bps-sidebar-animated');
      item.querySelectorAll('.bps-sidebar-icon-animated').forEach((icon) => {
        icon.classList.remove('bps-sidebar-icon-animated');
      });
    });
  }

  function markSidebarAnimationTarget(item) {
    if (!isSidebarAnimationItem(item)) {
      clearSidebarAnimationTargets();
      return;
    }

    clearSidebarAnimationTargets(item);
    item.classList.add('bps-sidebar-animated');
    const icon = item.querySelector('svg');
    if (icon) icon.classList.add('bps-sidebar-icon-animated');
  }

  document.addEventListener('pointerover', (event) => {
    const item = getSidebarNavigationTarget(event.target);
    if (item) {
      markSidebarAnimationTarget(item);
    } else {
      clearSidebarAnimationTargets();
    }
  }, true);

  document.addEventListener('pointerout', (event) => {
    const item = getSidebarNavigationTarget(event.target);
    const nextItem = event.relatedTarget && event.relatedTarget.nodeType === Node.ELEMENT_NODE
      ? getSidebarNavigationTarget(event.relatedTarget)
      : null;

    if (item && item !== nextItem) {
      clearSidebarAnimationTargets(nextItem);
    }
  }, true);

  document.addEventListener('click', (event) => {
    const item = getSidebarNavigationTarget(event.target);
    if (!item || document.documentElement.classList.contains('bps-no-animations')) return;

    markSidebarAnimationTarget(item);
    item.classList.remove('bps-sidebar-item-clicked');
    void item.offsetWidth;
    item.classList.add('bps-sidebar-item-clicked');

    if (item._bpsSidebarAnimationTimer) {
      clearTimeout(item._bpsSidebarAnimationTimer);
    }
    item._bpsSidebarAnimationTimer = setTimeout(() => {
      item.classList.remove('bps-sidebar-item-clicked');
      item._bpsSidebarAnimationTimer = null;
    }, 1100);
  }, true);

  // 4. React SPA osztályfigyelő – megvédi a témát lapváltáskor
  let reapplyTimer = null;
  const classObserver = new MutationObserver(() => {
    const root = document.documentElement;
    const needsReapply = state.enabled
      ? (state.themeActive && (!root.classList.contains('bps-theme-active')
        || !root.classList.contains('bps-dark-mode')
        || !root.classList.contains('dark')
        || root.getAttribute('data-bps-theme') !== state.theme))
      : (state.themeActive && (!root.classList.contains('bps-theme-active')
        || !root.classList.contains('bps-light-mode')
        || root.classList.contains('dark')
        || root.getAttribute('data-bps-theme') !== state.theme));

    if (needsReapply) {
      if (reapplyTimer) clearTimeout(reapplyTimer);
      reapplyTimer = setTimeout(() => {
        reapplyTimer = null;
        applyThemeClasses();
      }, 80);
    }
  });

  classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-bps-theme'] });

  // SPA navigáció figyelése (history API alapú, pl. React Router)
  (function patchHistoryNavigation() {
    let navigationTimer = null;

    function onNavigate() {
      if (navigationTimer) clearTimeout(navigationTimer);
      navigationTimer = setTimeout(() => {
        navigationTimer = null;
        applyThemeClasses();
        safeMaintenance();
      }, 200);
    }

    const origPushState = history.pushState.bind(history);
    const origReplaceState = history.replaceState.bind(history);

    history.pushState = function (...args) {
      origPushState(...args);
      onNavigate();
    };
    history.replaceState = function (...args) {
      origReplaceState(...args);
      onNavigate();
    };

    window.addEventListener('popstate', onNavigate);
  })();

  // 5. Lebegő gyorsgomb (jobb alsó sarok)
  let floatingBtn = null;

  function createFloatingButton() {
    const existingButton = document.getElementById('bps-floating-theme-toggle');
    if (existingButton) {
      existingButton.remove();
    }
    floatingBtn = null;
  }

  function updateFloatingButtonUI() {
    if (!floatingBtn) {
      floatingBtn = document.getElementById('bps-floating-theme-toggle');
    }
    if (!floatingBtn) return;

    if (!state.showFloatingButton) {
      floatingBtn.style.display = 'none';
      return;
    }

    floatingBtn.style.display = 'flex';
    const icon = document.createElement('span');
    icon.className = 'bps-toggle-icon';
    icon.textContent = state.enabled ? '🌙' : '☀️';
    const text = document.createElement('span');
    text.className = 'bps-toggle-text';
    text.textContent = state.enabled ? 'Sötét' : 'Világos';
    floatingBtn.replaceChildren(icon, text);
  }

  // 6. Fejléc Beállítások Gomb & Lenyíló Témaválasztó GUI
  let headerSettingsBtn = null;
  let settingsDropdown = null;

  function findHeaderTarget() {
    const svgs = document.querySelectorAll('svg');
    for (const svg of svgs) {
      const rect = svg.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= 80 && rect.right >= window.innerWidth - 220 && rect.width > 10) {
        const btn = svg.closest('button, a, div[role="button"]') || svg.parentElement;
        if (btn && btn.parentElement) {
          return { container: btn.parentElement, referenceNode: btn };
        }
      }
    }

    const header = document.querySelector('header');
    if (header) {
      const flexes = header.querySelectorAll('.flex, [class*="flex"]');
      for (let i = flexes.length - 1; i >= 0; i--) {
        const r = flexes[i].getBoundingClientRect();
        if (r.top <= 80 && r.right >= window.innerWidth - 180) {
          return { container: flexes[i], referenceNode: flexes[i].firstElementChild };
        }
      }
    }

    return null;
  }

  function injectHeaderSettingsButton() {
    if (window.self !== window.top) return;
    if (document.getElementById('bps-header-settings-btn')) return;

    const target = findHeaderTarget();
    if (!target || !target.container) return;

    headerSettingsBtn = document.createElement('button');
    headerSettingsBtn.type = 'button';
    headerSettingsBtn.id = 'bps-header-settings-btn';
    headerSettingsBtn.title = 'BPS Témaválasztó & Beállítások';
    headerSettingsBtn.setAttribute('aria-label', 'BPS Témaválasztó & Beállítások');

    const gearSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.entries({ xmlns: 'http://www.w3.org/2000/svg', width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'bps-gear-svg' })
      .forEach(([name, value]) => gearSvg.setAttribute(name, value));
    const gearPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gearPath.setAttribute('d', 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z');
    const gearCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    gearCircle.setAttribute('cx', '12');
    gearCircle.setAttribute('cy', '12');
    gearCircle.setAttribute('r', '3');
    gearSvg.replaceChildren(gearPath, gearCircle);
    headerSettingsBtn.replaceChildren(gearSvg);

    headerSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSettingsDropdown();
    });

    if (target.referenceNode) {
      target.container.insertBefore(headerSettingsBtn, target.referenceNode);
    } else {
      target.container.appendChild(headerSettingsBtn);
    }
  }

  function toggleSettingsDropdown() {
    if (settingsDropdown && settingsDropdown.parentElement) {
      closeSettingsDropdown();
      return;
    }
    openSettingsDropdown();
  }

  function selectSettingsTab(pageId) {
    if (!settingsDropdown) return;

    const requestedTab = settingsDropdown.querySelector(`.bps-settings-tab[data-settings-tab="${pageId}"]`);
    if (!requestedTab || requestedTab.hidden) {
      pageId = 'advanced';
    }

    const settingsTabs = settingsDropdown.querySelectorAll('.bps-settings-tab');
    settingsTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.settingsTab === pageId));

    settingsDropdown.querySelectorAll('.bps-settings-page').forEach((page) => {
      const isActive = page.dataset.settingsPage === pageId;
      page.classList.toggle('active', isActive);
      if (isActive) {
        page.classList.remove('bps-settings-page-enter');
        void page.offsetWidth;
        page.classList.add('bps-settings-page-enter');
      }
    });
  }

  function applySettingsTabVisibility() {
    if (!settingsDropdown) return;

    settingsDropdown.querySelectorAll('.bps-settings-tab').forEach((tab) => {
      const tabId = tab.dataset.settingsTab;
      const isVisible = tabId === 'advanced' || state.settingsTabVisibility[tabId] !== false;
      tab.hidden = !isVisible;
      tab.style.display = isVisible ? '' : 'none';
      tab.setAttribute('aria-hidden', String(!isVisible));

      const page = settingsDropdown.querySelector(`.bps-settings-page[data-settings-page="${tabId}"]`);
      if (page && !isVisible) {
        page.classList.remove('active');
        page.setAttribute('aria-hidden', 'true');
      } else if (page) {
        page.removeAttribute('aria-hidden');
      }
    });

    const activeTab = Array.from(settingsDropdown.querySelectorAll('.bps-settings-tab'))
      .find((tab) => tab.classList.contains('active') && !tab.hidden);
    if (!activeTab) {
      selectSettingsTab('advanced');
    }
  }

  function setSettingsTabVisibility(tabId, isVisible) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS_TAB_VISIBILITY, tabId)) return;

    state.settingsTabVisibility[tabId] = Boolean(isVisible);
    applySettingsTabVisibility();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_settings_tab_visibility', JSON.stringify(state.settingsTabVisibility));
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_settings_tab_visibility: state.settingsTabVisibility });
    }
  }

  function openSettingsDropdown() {
    if (!headerSettingsBtn) {
      headerSettingsBtn = document.getElementById('bps-header-settings-btn');
    }
    if (!headerSettingsBtn) return;

    closeSettingsDropdown();

    settingsDropdown = document.createElement('div');
    settingsDropdown.id = 'bps-settings-dropdown';

    const dropdownHtml = `
      <div class="bps-dropdown-header">
        <div class="bps-dropdown-title-group">
          <div class="bps-dropdown-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>BPS Témaválasztó</span>
          </div>
          <span class="bps-dropdown-subtitle">Sötét és világos módban is alkalmazható színek!</span>
        </div>
        <button type="button" class="bps-dropdown-close" id="bps-dropdown-close-btn">&times;</button>
      </div>

      <div class="bps-top-controls">
        <span class="bps-top-controls-label" id="bps-mode-label"></span>
        <label class="bps-switch">
          <input type="checkbox" id="bps-dropdown-theme-toggle">
          <span class="bps-switch-slider"></span>
        </label>
      </div>

      <div class="bps-settings-layout">
        <nav class="bps-settings-tabs" aria-label="Beállítás kategóriák">
          <button type="button" class="bps-settings-tab active" data-settings-tab="themes">
            <span>◈</span><span>Témák</span>
          </button>
          <button type="button" class="bps-settings-tab" data-settings-tab="preferences">
            <span>◌</span><span>Animációk</span>
          </button>
          <button type="button" class="bps-settings-tab" data-settings-tab="pranker">
            <span>⚠</span><span>Pranker</span>
          </button>
          <button type="button" class="bps-settings-tab" data-settings-tab="advanced">
            <span>⚙</span><span>Advanced</span>
          </button>
        </nav>

        <div class="bps-settings-pages">
          <section class="bps-settings-page active" data-settings-page="themes">
            <div class="bps-settings-section-title">
              <span class="bps-settings-section-icon">◈</span>
              <span>Témagaléria</span>
              <span class="bps-settings-section-line"></span>
            </div>
            <div class="bps-filter-section">
              <div class="bps-filter-instruction">Szűrés szín szerint</div>
              <div class="bps-filter-pills-box" id="bps-filter-pills-box"></div>
            </div>
            <div class="bps-theme-grid" id="bps-theme-grid"></div>
          </section>

          <section class="bps-settings-page" data-settings-page="preferences">
            <div class="bps-settings-section-title">
              <span class="bps-settings-section-icon">⚙</span>
              <span>Beállítások</span>
              <span class="bps-settings-section-line"></span>
            </div>
            <div class="bps-dropdown-footer">
              <label class="bps-checkbox-row">
                <span class="bps-setting-label">
                  <strong>Sima animációk</strong>
                  <small>Panel- és ikonmozgások</small>
                </span>
                <input type="checkbox" id="bps-animations-toggle">
              </label>
              <label class="bps-animation-style-row" for="bps-animation-style-select">
                <span class="bps-setting-label">
                  <strong>Animáció stílusa</strong>
                  <small>Az oldalsávikonok és kattintási effektek megjelenése</small>
                </span>
                <select id="bps-animation-style-select">
                  <option value="subtle">Finom</option>
                  <option value="strong">Erős</option>
                  <option value="neon">Neon</option>
                  <option value="bounce">Bounce</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
              <label class="bps-checkbox-row bps-setting-muted">
                <span class="bps-setting-label">
                  <strong>Gyorsbillentyű</strong>
                  <small>Alt + Shift + D</small>
                </span>
                <kbd title="Gyorsbillentyű a sötét/világos váltáshoz">AKTÍV</kbd>
              </label>
              <button type="button" class="bps-reset-colors-btn" id="bps-reset-colors-btn">
                Alapértelmezett színek visszaállítása
              </button>
            </div>
          </section>

          <section class="bps-settings-page" data-settings-page="pranker">
            <div class="bps-settings-section-title">
              <span class="bps-settings-section-icon">⚠</span>
              <span>Pranker</span>
              <span class="bps-settings-section-line"></span>
            </div>
            <p class="bps-pranker-note">
              Csak a te képernyődön látható próbaértékek. A Base44 valódi adatait nem módosítja.
            </p>
            <div class="bps-pranker-grid">
              <label class="bps-pranker-control" for="bps-pranker-exclamation">
                <span class="bps-pranker-icon bps-pranker-icon-exclamation">!</span>
                <span class="bps-setting-label"><strong>Felkiáltó</strong><small>Megjelenített darabszám</small></span>
                <input type="number" id="bps-pranker-exclamation" min="0" max="999999" step="1" inputmode="numeric">
              </label>
              <label class="bps-pranker-control" for="bps-pranker-minus">
                <span class="bps-pranker-icon bps-pranker-icon-minus">−</span>
                <span class="bps-setting-label"><strong>Mínusz</strong><small>Megjelenített darabszám</small></span>
                <input type="number" id="bps-pranker-minus" min="0" max="999999" step="1" inputmode="numeric">
              </label>
              <label class="bps-pranker-control" for="bps-pranker-plus">
                <span class="bps-pranker-icon bps-pranker-icon-plus">＋</span>
                <span class="bps-setting-label"><strong>Plusz</strong><small>Megjelenített darabszám</small></span>
                <input type="number" id="bps-pranker-plus" min="0" max="999999" step="1" inputmode="numeric">
              </label>
            </div>
            <button type="button" class="bps-pranker-reset-btn" id="bps-pranker-reset-btn">
              Valódi weboldalas értékek visszaállítása
            </button>
          </section>

          <section class="bps-settings-page" data-settings-page="advanced">
            <div class="bps-settings-section-title">
              <span class="bps-settings-section-icon">⚙</span>
              <span>Advanced</span>
              <span class="bps-settings-section-line"></span>
            </div>
            <p class="bps-pranker-note">
              Itt elrejthetsz beállítási füleket és módosíthatod az oldal betűtípusát. Az Advanced fül mindig elérhető marad.
            </p>
            <div class="bps-visibility-settings">
              <label class="bps-animation-style-row bps-font-family-row" for="bps-font-family-select">
                <span class="bps-setting-label">
                  <strong>Betűtípus</strong>
                  <small>Az oldal szövegének megjelenése</small>
                </span>
                <select id="bps-font-family-select">
                  <option value="default">Alapértelmezett</option>
                  <option value="inter">Inter</option>
                  <option value="poppins">Poppins</option>
                  <option value="space">Space Grotesk</option>
                  <option value="arial">Arial</option>
                  <option value="georgia">Georgia</option>
                  <option value="mono">Monospace</option>
                </select>
              </label>
              <div class="bps-font-preview-grid" id="bps-font-preview-grid" aria-label="Betűtípus előnézetek"></div>
              <label class="bps-checkbox-row" for="bps-settings-visibility-themes">
                <span class="bps-setting-label">
                  <strong>Témák fül</strong>
                  <small>Témagaléria és színszűrő</small>
                </span>
                <input type="checkbox" id="bps-settings-visibility-themes">
              </label>
              <label class="bps-checkbox-row" for="bps-settings-visibility-preferences">
                <span class="bps-setting-label">
                  <strong>Animációk fül</strong>
                  <small>Animációs beállítások</small>
                </span>
                <input type="checkbox" id="bps-settings-visibility-preferences">
              </label>
              <label class="bps-checkbox-row" for="bps-settings-visibility-pranker">
                <span class="bps-setting-label">
                  <strong>Pranker fül</strong>
                  <small>Helyi számláló-átírások</small>
                </span>
                <input type="checkbox" id="bps-settings-visibility-pranker">
              </label>
            </div>
          </section>
        </div>
      </div>
    `;

    const parsedDropdown = new DOMParser().parseFromString(dropdownHtml, 'text/html');
    settingsDropdown.replaceChildren(...parsedDropdown.body.childNodes);

    const initialModeLabel = settingsDropdown.querySelector('#bps-mode-label');
    initialModeLabel.textContent = !state.themeActive
      ? (state.theme === 'amber-gold' && state.enabled
        ? 'Natív fekete mód'
        : 'Alapértelmezett színek')
      : (state.enabled ? 'Sötét Téma Aktív' : 'Világos Téma Aktív');

    const initialThemeToggle = settingsDropdown.querySelector('#bps-dropdown-theme-toggle');
    initialThemeToggle.checked = Boolean(state.themeActive && state.enabled);

    const initialAnimationsToggle = settingsDropdown.querySelector('#bps-animations-toggle');
    initialAnimationsToggle.checked = Boolean(state.enableAnimations);

    const initialAnimationStyleSelect = settingsDropdown.querySelector('#bps-animation-style-select');
    initialAnimationStyleSelect.value = state.animationStyle;

    const initialFontFamilySelect = settingsDropdown.querySelector('#bps-font-family-select');
    initialFontFamilySelect.value = state.fontFamily;

    const fontPreviewGrid = settingsDropdown.querySelector('#bps-font-preview-grid');
    if (fontPreviewGrid) {
      Object.entries(FONT_FAMILY_LABELS).forEach(([fontId, label]) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'bps-font-preview-card';
        card.dataset.fontFamily = fontId;
        card.setAttribute('aria-label', `${label} betűtípus kiválasztása`);
        if (state.fontFamily === fontId) card.classList.add('active');

        const sample = document.createElement('span');
        sample.className = 'bps-font-preview-sample';
        sample.textContent = 'Aa Áá 123';
        if (FONT_FAMILY_OPTIONS[fontId]) {
          sample.style.fontFamily = FONT_FAMILY_OPTIONS[fontId];
        }

        const name = document.createElement('span');
        name.className = 'bps-font-preview-name';
        name.textContent = label;

        card.append(sample, name);
        card.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          setFontFamily(fontId);
        });
        fontPreviewGrid.appendChild(card);
      });
    }

    const filterPillsBox = settingsDropdown.querySelector('#bps-filter-pills-box');
    FILTER_COLORS.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'bps-filter-row';
      row.forEach(item => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'bps-filter-pill';
        pill.dataset.color = item.id;
        pill.style.setProperty('--pill-color', item.color);
        pill.title = item.title;
        if (state.activeFilter === item.id) pill.classList.add('active');
        rowDiv.appendChild(pill);
      });
      filterPillsBox.appendChild(rowDiv);
    });

    const initialThemeGrid = settingsDropdown.querySelector('#bps-theme-grid');
    THEMES.forEach(t => {
      const card = document.createElement('div');
      card.className = 'bps-theme-card';
      card.dataset.themeId = t.id;
      card.dataset.tags = t.tags.join(',');
      if (state.themeActive && state.theme === t.id) card.classList.add('active');
      if (state.activeFilter && !t.tags.includes(state.activeFilter)) {
        card.style.display = 'none';
      }

      const preview = document.createElement('div');
      preview.className = 'bps-theme-card-preview';
      preview.style.setProperty('--theme-gradient', t.gradient);

      const label = document.createElement('div');
      label.className = 'bps-theme-card-label';
      label.title = t.name;
      label.textContent = t.name;

      card.append(preview, label);
      initialThemeGrid.appendChild(card);
    });

    document.body.appendChild(settingsDropdown);
    applySettingsTabVisibility();

    const rect = headerSettingsBtn.getBoundingClientRect();
    settingsDropdown.style.top = `${rect.bottom + 8}px`;
    const rightOffset = window.innerWidth - rect.right;
    settingsDropdown.style.right = `${Math.max(14, rightOffset)}px`;

    const closeBtn = settingsDropdown.querySelector('#bps-dropdown-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSettingsDropdown();
      });
    }

    const themeToggle = settingsDropdown.querySelector('#bps-dropdown-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', (e) => {
        toggleTheme(e.target.checked);
      });
    }

    const animationsToggle = settingsDropdown.querySelector('#bps-animations-toggle');
    if (animationsToggle) {
      animationsToggle.addEventListener('change', (e) => {
        setAnimationsEnabled(e.target.checked);
      });
    }

    const animationStyleSelect = settingsDropdown.querySelector('#bps-animation-style-select');
    if (animationStyleSelect) {
      animationStyleSelect.addEventListener('change', (e) => {
        setAnimationStyle(e.target.value);
      });
    }

    const fontFamilySelect = settingsDropdown.querySelector('#bps-font-family-select');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', (e) => {
        setFontFamily(e.target.value);
      });
    }

    const performanceToggle = settingsDropdown.querySelector('#bps-performance-toggle');
    if (performanceToggle) {
      performanceToggle.addEventListener('change', (e) => {
        setPerformanceMode(e.target.checked);
      });
    }

    const debugToggle = settingsDropdown.querySelector('#bps-debug-toggle');
    if (debugToggle) {
      debugToggle.addEventListener('change', (e) => {
        setDebugMode(e.target.checked);
      });
    }

    const settingsTabs = settingsDropdown.querySelectorAll('.bps-settings-tab');
    settingsTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        selectSettingsTab(tab.dataset.settingsTab);
      });
    });

    const prankerInputs = {
      exclamation: settingsDropdown.querySelector('#bps-pranker-exclamation'),
      minus: settingsDropdown.querySelector('#bps-pranker-minus'),
      plus: settingsDropdown.querySelector('#bps-pranker-plus')
    };
    const initialPrankerValues = state.prankerActive
      ? state.prankerCounts
      : getActualPrankerCounts();
    Object.entries(prankerInputs).forEach(([label, input]) => {
      if (!input) return;
      input.value = String(initialPrankerValues[label]);
      input.addEventListener('change', () => {
        setPrankerCount(label, input.value);
      });
    });

    const prankerResetButton = settingsDropdown.querySelector('#bps-pranker-reset-btn');
    if (prankerResetButton) {
      prankerResetButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetPrankerCounts();
      });
    }

    const settingsVisibilityInputs = {
      themes: settingsDropdown.querySelector('#bps-settings-visibility-themes'),
      preferences: settingsDropdown.querySelector('#bps-settings-visibility-preferences'),
      pranker: settingsDropdown.querySelector('#bps-settings-visibility-pranker')
    };
    Object.entries(settingsVisibilityInputs).forEach(([tabId, input]) => {
      if (!input) return;
      input.checked = state.settingsTabVisibility[tabId] !== false;
      input.addEventListener('change', () => {
        setSettingsTabVisibility(tabId, input.checked);
      });
    });

    const resetColorsButton = settingsDropdown.querySelector('#bps-reset-colors-btn');
    if (resetColorsButton) {
      resetColorsButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetToDefaultColors();
      });
    }

    const filterPills = settingsDropdown.querySelectorAll('.bps-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const colorId = pill.dataset.color;
        if (state.activeFilter === colorId) {
          state.activeFilter = null;
        } else {
          state.activeFilter = colorId;
        }
        updateFilterView();
      });
    });

    const themeCards = settingsDropdown.querySelectorAll('.bps-theme-card');
    themeCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = card.dataset.themeId;
        setTheme(themeId);
      });
    });

    const floatingToggle = settingsDropdown.querySelector('#bps-dropdown-floating-toggle');
    if (floatingToggle) {
      floatingToggle.addEventListener('change', (e) => {
        setShowFloatingButton(e.target.checked);
      });
    }

    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);
  }

  function updateFilterView() {
    if (!settingsDropdown) return;
    const filterPills = settingsDropdown.querySelectorAll('.bps-filter-pill');
    filterPills.forEach(p => {
      if (p.dataset.color === state.activeFilter) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    const cards = settingsDropdown.querySelectorAll('.bps-theme-card');
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      if (!state.activeFilter || tags.includes(state.activeFilter)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function handleOutsideClick(e) {
    if (!settingsDropdown) return;
    if (!settingsDropdown.contains(e.target) && (!headerSettingsBtn || !headerSettingsBtn.contains(e.target))) {
      closeSettingsDropdown();
    }
  }

  function closeSettingsDropdown() {
    if (settingsDropdown && settingsDropdown.parentElement) {
      settingsDropdown.remove();
    }
    settingsDropdown = null;
    document.removeEventListener('click', handleOutsideClick);
  }

  function updateDropdownUI() {
    if (!settingsDropdown) return;
    const themeToggle = settingsDropdown.querySelector('#bps-dropdown-theme-toggle');
    if (themeToggle) {
      themeToggle.checked = state.themeActive && state.enabled;
    }
    const modeLabel = settingsDropdown.querySelector('#bps-mode-label');
    if (modeLabel) {
      modeLabel.textContent = !state.themeActive
        ? (state.theme === 'amber-gold' && state.enabled
          ? 'Natív fekete mód'
          : 'Alapértelmezett színek')
        : (state.enabled ? 'Sötét Téma Aktív' : 'Világos Téma Aktív');
    }
    const themeName = settingsDropdown.querySelector('#bps-current-theme-name');
    if (themeName) {
      themeName.textContent = THEMES.find(t => t.id === state.theme)?.name || state.theme;
    }
    const animationsToggle = settingsDropdown.querySelector('#bps-animations-toggle');
    if (animationsToggle) {
      animationsToggle.checked = state.enableAnimations;
    }
    const animationStyleSelect = settingsDropdown.querySelector('#bps-animation-style-select');
    if (animationStyleSelect) {
      animationStyleSelect.value = state.animationStyle;
    }
    const fontFamilySelect = settingsDropdown.querySelector('#bps-font-family-select');
    if (fontFamilySelect) {
      fontFamilySelect.value = state.fontFamily;
    }
    settingsDropdown.querySelectorAll('.bps-font-preview-card').forEach(card => {
      card.classList.toggle('active', card.dataset.fontFamily === state.fontFamily);
    });
    const performanceToggle = settingsDropdown.querySelector('#bps-performance-toggle');
    if (performanceToggle) {
      performanceToggle.checked = state.performanceMode;
    }
    const debugToggle = settingsDropdown.querySelector('#bps-debug-toggle');
    if (debugToggle) {
      debugToggle.checked = state.debugMode;
    }
    const debugInfo = settingsDropdown.querySelector('#bps-debug-info');
    if (debugInfo) {
      debugInfo.hidden = !state.debugMode;
      debugInfo.textContent = state.debugMode ? getDebugSummary() : '';
    }
    const cards = settingsDropdown.querySelectorAll('.bps-theme-card');
    cards.forEach(c => {
      if (state.themeActive && c.dataset.themeId === state.theme) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    const prankerInputs = {
      exclamation: settingsDropdown.querySelector('#bps-pranker-exclamation'),
      minus: settingsDropdown.querySelector('#bps-pranker-minus'),
      plus: settingsDropdown.querySelector('#bps-pranker-plus')
    };
    const prankerInputValues = state.prankerActive
      ? state.prankerCounts
      : getActualPrankerCounts();
    Object.entries(prankerInputs).forEach(([label, input]) => {
      if (input && document.activeElement !== input) {
        input.value = String(prankerInputValues[label]);
      }
    });
    const settingsVisibilityInputs = {
      themes: settingsDropdown.querySelector('#bps-settings-visibility-themes'),
      preferences: settingsDropdown.querySelector('#bps-settings-visibility-preferences'),
      pranker: settingsDropdown.querySelector('#bps-settings-visibility-pranker')
    };
    Object.entries(settingsVisibilityInputs).forEach(([tabId, input]) => {
      if (input) input.checked = state.settingsTabVisibility[tabId] !== false;
    });
    const floatingToggle = settingsDropdown.querySelector('#bps-dropdown-floating-toggle');
    if (floatingToggle) {
      floatingToggle.checked = state.showFloatingButton;
    }
  }

  // 7. Téma kapcsoló és beállító függvények
  function toggleTheme(nextEnabled) {
    state.enabled = nextEnabled;
    state.themeActive = state.theme !== 'amber-gold';
    applyThemeClasses();
    updateFloatingButtonUI();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_dark_theme_enabled', String(state.enabled));
      localStorage.setItem('bps_theme_active', String(state.themeActive));
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_dark_theme_enabled: state.enabled, bps_theme_active: state.themeActive });
    }
  }

  function resetToDefaultColors() {
    state.theme = 'amber-gold';
    state.themeActive = false;
    applyThemeClasses();
    updateFloatingButtonUI();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_dark_theme_id', state.theme);
      localStorage.setItem('bps_theme_active', 'false');
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_dark_theme_id: state.theme, bps_theme_active: false, bps_dark_theme_enabled: state.enabled });
    }
  }

  function setTheme(themeId) {
    state.theme = themeId;
    // Gellért Gold represents the Base44 native/default dark palette.
    state.themeActive = themeId !== 'amber-gold';
    applyThemeClasses();
    updateFloatingButtonUI();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_dark_theme_id', state.theme);
      localStorage.setItem('bps_theme_active', String(state.themeActive));
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_dark_theme_id: state.theme, bps_theme_active: state.themeActive });
    }
  }

  function setShowFloatingButton(show) {
    state.showFloatingButton = show;
    updateFloatingButtonUI();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_show_floating_button', String(state.showFloatingButton));
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_show_floating_button: state.showFloatingButton });
    }
  }

  function setAnimationsEnabled(enabled) {
    state.enableAnimations = enabled;
    document.documentElement.classList.toggle('bps-no-animations', !enabled || state.performanceMode);
    updateDropdownUI();

    try {
      localStorage.setItem('bps_enable_animations', String(enabled));
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_enable_animations: enabled });
    }
  }

  function setAnimationStyle(style) {
    const validStyles = ['subtle', 'strong', 'neon', 'bounce', 'minimal'];
    if (!validStyles.includes(style)) return;
    state.animationStyle = style;
    applyAnimationStyleClass();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_animation_style', style);
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_animation_style: style });
    }
  }

  function setFontFamily(fontFamily) {
    state.fontFamily = sanitizeFontFamily(fontFamily);
    applyFontFamily();
    updateDropdownUI();

    try {
      localStorage.setItem('bps_font_family', state.fontFamily);
    } catch (e) {}

    if (storageApi) {
      storageApi.set({ bps_font_family: state.fontFamily });
    }
  }

  function setPerformanceMode(enabled) {
    state.performanceMode = enabled;
    applyThemeClasses();
    updateDropdownUI();
    try {
      localStorage.setItem('bps_performance_mode', String(enabled));
    } catch (e) {}
    if (storageApi) {
      storageApi.set({ bps_performance_mode: enabled });
    }
  }

  function getDebugSummary() {
    const root = document.documentElement;
    return [
      `Téma: ${state.theme}`,
      `Mód: ${state.enabled ? 'sötét' : 'világos'}`,
      `Egyedi színek: ${state.themeActive ? 'be' : 'ki'}`,
      `Teljesítmény mód: ${state.performanceMode ? 'be' : 'ki'}`,
      `Animációk: ${state.enableAnimations && !state.performanceMode ? 'be' : 'ki'}`,
      `Animáció stílusa: ${state.animationStyle}`,
      `Betűtípus: ${state.fontFamily}`,
      `Digi oldal: ${root.classList.contains('bps-digi-page') ? 'igen' : 'nem'}`,
      `Settings panel: ${settingsDropdown ? 'nyitva' : 'zárva'}`
    ].join('\n');
  }

  function setDebugMode(enabled) {
    state.debugMode = enabled;
    if (enabled) {
      console.info('[BPS theme] Debug mód bekapcsolva.');
    }
    updateDropdownUI();
    try {
      localStorage.setItem('bps_debug_mode', String(enabled));
    } catch (e) {}
    if (storageApi) {
      storageApi.set({ bps_debug_mode: enabled });
    }
  }

  // 8. Gyorsbillentyűk kezelése
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsDropdown) {
      closeSettingsDropdown();
    }
    if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      toggleTheme(!state.enabled);
    }
  });

  // 9. Üzenetek fogadása az Extension Popup ablakból
  const runtime = (typeof browser !== 'undefined' && browser.runtime) ? browser.runtime : (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime : null);
  if (runtime && runtime.onMessage) {
    runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getStatus') {
        sendResponse({
          enabled: state.enabled,
          theme: state.theme,
          showFloatingButton: state.showFloatingButton,
          enableAnimations: state.enableAnimations,
          animationStyle: state.animationStyle,
          fontFamily: state.fontFamily,
          performanceMode: state.performanceMode,
          debugMode: state.debugMode
        });
      } else if (request.action === 'toggleTheme') {
        toggleTheme(request.enabled);
        sendResponse({ success: true, enabled: state.enabled });
      } else if (request.action === 'setTheme') {
        setTheme(request.themeId);
        sendResponse({ success: true, theme: state.theme });
      } else if (request.action === 'toggleFloatingButton') {
        setShowFloatingButton(request.show);
        sendResponse({ success: true, showFloatingButton: state.showFloatingButton });
      }
      return true;
    });
  }

  // 10. Könnyűsúlyú inicializálás és periodikus ellenőrzés (0% CPU, zéró lag)
  function safeMaintenance() {
    if (!document.getElementById('bps-header-settings-btn')) {
      injectHeaderSettingsButton();
    }
    syncSidebarItemDisplay();
    attachSidebarItemListener();
    syncDigiClassAnimation();
    syncDigiPageNativeCards();
    applyPrankerCounts();
  }

  function initPageElements() {
    createFloatingButton();
    safeMaintenance();
    // A React által újrarenderelt oldalsávot csak ritkán ellenőrizzük.
    setInterval(safeMaintenance, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageElements);
  } else {
    initPageElements();
  }

  window.addEventListener('load', safeMaintenance);
})();
