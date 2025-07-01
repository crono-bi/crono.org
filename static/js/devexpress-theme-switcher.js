(function() {
  function updateDevExpressTheme() {
    const isDarkTheme = document.documentElement.dataset.theme === 'dark';
    const themeLink = document.getElementById('devexpress-theme');
    
    if (themeLink) {
      const themeUrl = isDarkTheme 
        ? 'https://cdn3.devexpress.com/jslib/23.2.3/css/dx.dark.css'
        : 'https://cdn3.devexpress.com/jslib/23.2.3/css/dx.light.css';
      
      if (themeLink.href !== themeUrl) {
        themeLink.href = themeUrl;
        console.log(`DevExpress theme switched to ${isDarkTheme ? 'dark' : 'light'} mode`);
      }
    }
  }

  updateDevExpressTheme();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' && 
        mutation.attributeName === 'data-theme'
      ) {
        updateDevExpressTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
