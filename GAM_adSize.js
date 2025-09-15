(function() {
  const adSlotId = 'div-gpt-ad-1752221051789-0';
  const adUnitPath = '/37275962/leona_RWDtest';

  function createAdContainer() {
    if (!document.getElementById(adSlotId)) {
      const adDiv = document.createElement('div');
      adDiv.id = adSlotId;
      adDiv.style.minWidth = '300px';
      adDiv.style.minHeight = '90px';
      adDiv.style.textAlign = 'center';
      document.body.appendChild(adDiv);
      console.log('廣告已建立:', adSlotId);
    }
  }
  
  const allAdSizes = [[970, 90], [728, 90], [300, 250]];
  function loadGPT() {
    return new Promise((resolve) => {
      if (window.googletag && window.googletag.apiReady) {
        resolve();
        return;
      }
      const gptScript = document.createElement('script');
      gptScript.async = true;
      gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      gptScript.onload = resolve;
      document.head.appendChild(gptScript);
    });
  }
  
  // 初始化廣告
  function initializeAd() {
    const currentWidth = window.innerWidth;
    
    console.log('目前視窗寬度:', currentWidth + 'px');
    
    
    window.googletag = window.googletag || { cmd: [] };
    
    googletag.cmd.push(function() {
      const adSlot = googletag.defineSlot(adUnitPath, allAdSizes, adSlotId)
        .defineSizeMapping(
          googletag.sizeMapping()
            .addSize([1200, 0], [970, 90]) //螢幕大於1200px時顯示970x90    
            .addSize([768, 0], [728, 90])   // 螢幕大於768px時顯示728x90   
            .addSize([0, 0], [300, 250])    // 螢幕小於768px時顯示300x250
            .build()
        )
        .addService(googletag.pubads());
      
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();

      googletag.display(adSlotId);
      
      console.log('廣告已初始化並顯示');
    });
  }
  
  // 處理視窗大小改變
  function windowResize() {
    const currentWidth = window.innerWidth;
    
    console.log('改變螢幕大小:', currentWidth + 'px');
    
    // sizeMapping 會自動處理尺寸切換，只需要刷新廣告
    if (window.googletag && window.googletag.pubads) {
      googletag.cmd.push(function() {
        googletag.pubads().refresh();
      });
    }
  }
  
  // 主要初始化函數
  async function init() {
    try {
      createAdContainer();
      await loadGPT();// 等待 GPT 腳本加載完成
      initializeAd();
      
   
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(windowResize, 250);
      });
      
      window.adSlotInitialized = true;
      
    } catch (error) {
      console.error('廣告初始化失敗:', error);
    }
  }
  

    init();

  
})();