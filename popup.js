document.addEventListener('DOMContentLoaded', async () => {
  const siteEl = document.getElementById('currentSite');
  const btnEl = document.getElementById('blockBtn');
  const msgEl = document.getElementById('message');
  let currentDomain = '';

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url && tab.url.startsWith('http')) {
      let url = new URL(tab.url);
      currentDomain = url.hostname.replace('www.', '');
      siteEl.textContent = currentDomain;

      const result = await chrome.storage.sync.get(['blockedList']);
      let list = result.blockedList || [];
      
      if (list.includes(currentDomain)) {
        btnEl.textContent = "Already Blocked";
        btnEl.disabled = true;
        btnEl.style.background = '#404040';
      }
    } else {
      siteEl.textContent = "Not a valid website";
      btnEl.disabled = true;
      btnEl.style.background = '#404040';
    }
  } catch (e) {
    siteEl.textContent = "Cannot block this page";
    btnEl.disabled = true;
    btnEl.style.background = '#404040';
  }

  btnEl.addEventListener('click', async () => {
    if (!currentDomain) return;

    const result = await chrome.storage.sync.get(['blockedList']);
    let list = result.blockedList || [];

    if (!list.includes(currentDomain)) {
      list.push(currentDomain);
      await chrome.storage.sync.set({ blockedList: list });
      
      msgEl.textContent = "Added to blocklist";
      btnEl.textContent = "Blocked";
      btnEl.disabled = true;
      btnEl.style.background = '#404040';
    }
  });
  
  document.getElementById('optionsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});