document.addEventListener('DOMContentLoaded', async () => {
  const presetIcons = {
    gambling: '♠',
    social: '◐',
    entertainment: '▶',
    gaming: '◈',
    shopping: '◉',
    news: '◈',
    adult: '●'
  };

  const presetNames = {
    gambling: 'Gambling & Betting',
    social: 'Social Media',
    entertainment: 'Entertainment',
    gaming: 'Gaming Platforms',
    shopping: 'Shopping Sites',
    news: 'News & Media',
    adult: 'Adult Content'
  };

  const passwordGate = document.getElementById('password-gate');
  const mainContent = document.getElementById('main-content');
  const passwordInput = document.getElementById('passwordInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordError = document.getElementById('passwordError');
  const passwordSetup = document.getElementById('password-setup');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const setPasswordBtn = document.getElementById('setPasswordBtn');
  const listContainer = document.getElementById('listContainer');
  const manualAddInput = document.getElementById('manualAddInput');
  const manualAddBtn = document.getElementById('manualAddBtn');
  const presetGrid = document.getElementById('presetGrid');
  const clearAllBtn = document.getElementById('clearAllBtn');

  let savedPassword = null;
  let availablePresets = {};

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      
      item.classList.add('active');
      document.getElementById(`page-${page}`).classList.add('active');
    });
  });

  // Quick navigation buttons
  document.querySelectorAll('.quick-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const targetNav = document.querySelector(`[data-page="${target}"]`);
      if (targetNav) targetNav.click();
    });
  });

  // Mode Toggle
  document.querySelectorAll('.toggle-option').forEach(option => {
    option.addEventListener('click', async () => {
      const mode = option.dataset.mode;
      
      document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      await chrome.storage.sync.set({ mode: mode });
      updateStats();
    });
  });

  // Load presets from background
  async function loadPresets() {
    try {
      const result = await chrome.storage.local.get(['presets']);
      availablePresets = result.presets || {};
      
      console.log('Loaded presets:', availablePresets);
      
      // Если пресетов нет в storage, загружаем из background.js
      if (Object.keys(availablePresets).length === 0) {
        console.log('No presets found, initializing...');
        // Триггерим повторную установку пресетов
        await chrome.runtime.sendMessage({ action: 'getPresets' }).catch(() => {
          // Если не получилось через message, используем дефолтные значения
          availablePresets = getDefaultPresets();
        });
      }
      
      renderPresets();
    } catch (error) {
      console.error('Error loading presets:', error);
      availablePresets = getDefaultPresets();
      renderPresets();
    }
  }

  // Дефолтные пресеты на случай ошибки
  function getDefaultPresets() {
    return {
      gambling: [
        "1xbet.com", "fonbet.ru", "parimatch.ru", "ligastavok.ru", "betboom.ru", "leon.ru",
        "mostbet.com", "1win.pro", "pinnacle.com", "bet365.com", "gg.bet",
        "vulkan-casino.com", "casino-x.com", "joycasino.com", "vavada.com", "playfortuna.com",
        "pin-up.casino", "stake.com", "vulkanvegas.com", "roxcasino.com", "jet.casino",
        "csgorun.com", "csgo-roll.com", "csgoempire.com", "csgofast.com", "loot.farm",
        "pokerstars.com", "partypoker.com", "888poker.com", "ggpoker.com", "playplg.bet", 
        "plg.bet", "case-battle.life", "betway.com", "bwin.com"
      ],
      social: [
        "facebook.com", "instagram.com", "twitter.com", "x.com", "tiktok.com",
        "reddit.com", "snapchat.com", "pinterest.com", "linkedin.com", "vk.com",
        "ok.ru", "telegram.org"
      ],
      entertainment: [
        "youtube.com", "netflix.com", "twitch.tv", "hulu.com", "disneyplus.com",
        "hbo.com", "primevideo.com", "spotify.com", "soundcloud.com"
      ],
      gaming: [
        "steampowered.com", "epicgames.com", "battle.net", "roblox.com", 
        "minecraft.net", "leagueoflegends.com", "valorant.com", "fortnite.com"
      ],
      shopping: [
        "amazon.com", "ebay.com", "aliexpress.com", "etsy.com", "wish.com",
        "walmart.com", "target.com", "bestbuy.com", "ozon.ru", "wildberries.ru"
      ],
      news: [
        "cnn.com", "bbc.com", "nytimes.com", "theguardian.com", "foxnews.com",
        "reddit.com", "buzzfeed.com", "huffpost.com"
      ],
      adult: [
        "pornhub.com", "xvideos.com", "xnxx.com", "redtube.com", "youporn.com",
        "xhamster.com", "chaturbate.com", "onlyfans.com"
      ]
    };
  }

  function renderPresets() {
    if (!presetGrid) {
      console.error('presetGrid element not found');
      return;
    }
    
    presetGrid.innerHTML = '';
    
    const keys = Object.keys(availablePresets);
    console.log('Rendering presets, keys:', keys);
    
    if (keys.length === 0) {
      presetGrid.innerHTML = '<div style="color: #777; padding: 20px;">No presets available</div>';
      return;
    }
    
    keys.forEach(key => {
      const card = document.createElement('div');
      card.className = 'preset-card';
      card.dataset.preset = key;
      
      const count = availablePresets[key].length;
      
      card.innerHTML = `
        <div class="preset-icon">${presetIcons[key] || '▣'}</div>
        <div class="preset-name">${presetNames[key] || key}</div>
        <div class="preset-count">${count} sites</div>
      `;
      
      card.addEventListener('click', () => loadPreset(key));
      presetGrid.appendChild(card);
    });
    
    updatePresetStates();
  }

  async function updatePresetStates() {
    const list = await getList();
    
    document.querySelectorAll('.preset-card').forEach(card => {
      const presetKey = card.dataset.preset;
      const presetSites = availablePresets[presetKey] || [];
      
      const allIncluded = presetSites.every(site => list.includes(site));
      card.classList.toggle('loaded', allIncluded);
    });
  }

  async function loadPreset(presetKey) {
    const presetSites = availablePresets[presetKey] || [];
    if (presetSites.length === 0) return;
    
    let list = await getList();
    let addedCount = 0;
    
    presetSites.forEach(domain => {
      if (!list.includes(domain)) {
        list.push(domain);
        addedCount++;
      }
    });
    
    await saveList(list);
    updatePresetStates();
    alert(`Added ${addedCount} new site${addedCount !== 1 ? 's' : ''} from ${presetNames[presetKey]}`);
  }

  // Render List
  function renderList(list = []) {
    listContainer.innerHTML = '';
    
    const siteCountText = document.getElementById('siteCountText');
    const totalSites = document.getElementById('totalSites');
    
    if (totalSites) totalSites.textContent = list.length;
    if (siteCountText) siteCountText.textContent = list.length === 0 ? 'No sites blocked yet' : `${list.length} site${list.length !== 1 ? 's' : ''} blocked`;
    
    if (list.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">○</div>
          <div>No sites in your blocklist</div>
        </div>
      `;
      return;
    }
    
    list.sort().forEach(domain => {
      const item = document.createElement('div');
      item.className = 'site-item';
      
      const name = document.createElement('span');
      name.className = 'site-name';
      name.textContent = domain;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-ghost btn-small';
      deleteBtn.textContent = 'Remove';
      deleteBtn.dataset.domain = domain;
      
      item.appendChild(name);
      item.appendChild(deleteBtn);
      listContainer.appendChild(item);
    });
  }

  async function getList() {
    const result = await chrome.storage.sync.get(['blockedList']);
    return result.blockedList || [];
  }

  async function saveList(list) {
    await chrome.storage.sync.set({ blockedList: list });
    renderList(list);
  }

  async function addDomain(domain) {
    if (!domain) return;
    let list = await getList();
    if (!list.includes(domain)) {
      list.push(domain);
      await saveList(list);
    }
  }

  async function updateStats() {
    const data = await chrome.storage.sync.get(['mode']);
    const mode = data.mode || 'blacklist';
    const modeDisplay = document.getElementById('modeDisplay');
    if (modeDisplay) {
      modeDisplay.textContent = mode === 'blacklist' ? 'Blacklist' : 'Whitelist';
    }
    
    document.querySelectorAll('.toggle-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.mode === mode);
    });
  }

  function showMainContent() {
    passwordGate.style.display = 'none';
    mainContent.style.display = 'block';
    loadSettings();
  }

  async function loadSettings() {
    await loadPresets();
    const list = await getList();
    renderList(list);
    updateStats();
  }

  // Check password
  const { password } = await chrome.storage.sync.get('password');
  savedPassword = password;

  if (!savedPassword) {
    passwordSetup.style.display = 'block';
    showMainContent();
  } else {
    passwordSetup.style.display = 'none';
    passwordGate.style.display = 'flex';
  }

  // Unlock
  unlockBtn.addEventListener('click', () => {
    if (passwordInput.value === savedPassword) {
      showMainContent();
      passwordError.textContent = '';
    } else {
      passwordError.textContent = 'Incorrect password';
      passwordInput.value = '';
    }
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') unlockBtn.click();
  });

  // Set Password
  setPasswordBtn.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value;
    if (newPassword && newPassword.length >= 4) {
      await chrome.storage.sync.set({ password: newPassword });
      savedPassword = newPassword;
      passwordSetup.style.display = 'none';
      alert('Password set successfully');
    } else {
      alert('Password must be at least 4 characters');
    }
  });

  // Add Site
  manualAddBtn.addEventListener('click', async () => {
    let domain = manualAddInput.value.trim().replace('www.', '').toLowerCase();
    if (domain) {
      await addDomain(domain);
      manualAddInput.value = '';
      updatePresetStates();
    }
  });

  manualAddInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') manualAddBtn.click();
  });

  // Remove Site
  listContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-ghost')) {
      const domain = e.target.dataset.domain;
      let list = await getList();
      list = list.filter(d => d !== domain);
      await saveList(list);
      updatePresetStates();
    }
  });

  // Clear All
  clearAllBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to remove ALL blocked sites? This cannot be undone.')) {
      await saveList([]);
      updatePresetStates();
      alert('All sites cleared');
    }
  });
});