// Preset categories
const presets = {
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

const RULE_ID_WHITELIST_BLOCK_ALL = 1;
const RULE_ID_BLACKLIST_OFFSET = 1000;
const RULE_ID_WHITELIST_ALLOW_OFFSET = 2000;

async function updateBlockingRules() {
  const data = await chrome.storage.sync.get(['blockedList', 'mode']);
  const blockedList = data.blockedList || [];
  const mode = data.mode || 'blacklist';

  let addRules = [];
  let removeRuleIds = [RULE_ID_WHITELIST_BLOCK_ALL];

  for (let i = 1; i <= 5000; i++) {
    removeRuleIds.push(RULE_ID_BLACKLIST_OFFSET + i);
    removeRuleIds.push(RULE_ID_WHITELIST_ALLOW_OFFSET + i);
  }

  if (mode === 'blacklist') {
    blockedList.forEach((domain, index) => {
      const id = RULE_ID_BLACKLIST_OFFSET + index + 1;
      addRules.push({
        "id": id,
        "priority": 1,
        "action": {
          "type": "redirect",
          "redirect": { "extensionPath": "/blocked.html" }
        },
        "condition": {
          "urlFilter": `*://${domain.replace('www.', '')}/*`,
          "resourceTypes": ["main_frame"]
        }
      }, {
        "id": id + 5000, 
        "priority": 1,
        "action": {
          "type": "redirect",
          "redirect": { "extensionPath": "/blocked.html" }
        },
        "condition": {
          "urlFilter": `*://www.${domain.replace('www.', '')}/*`,
          "resourceTypes": ["main_frame"]
        }
      });
    });
  } else if (mode === 'whitelist') {
    addRules.push({
      "id": RULE_ID_WHITELIST_BLOCK_ALL,
      "priority": 1,
      "action": {
        "type": "redirect",
        "redirect": { "extensionPath": "/blocked.html" }
      },
      "condition": {
        "urlFilter": `*://*/*`,
        "excludedInitiatorDomains": blockedList.map(domain => domain.replace('www.', '')),
        "resourceTypes": ["main_frame"]
      }
    });
  }
  
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: removeRuleIds,
    addRules: addRules
  });
}

chrome.runtime.onInstalled.addListener(async (details) => {
  await chrome.storage.local.set({ presets: presets });
  
  if (details.reason === "install") {
    await chrome.storage.sync.set({ 
      blockedList: [], 
      mode: 'blacklist' 
    });
  }
  updateBlockingRules();
});

chrome.runtime.onStartup.addListener(updateBlockingRules);
chrome.storage.onChanged.addListener(updateBlockingRules);