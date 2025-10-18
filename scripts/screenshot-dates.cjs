const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  });
  const page = await browser.newPage();

  // Set mobile viewport to match your phone
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  console.log('Opening Commune box note in visible browser...');
  console.log('Chrome will stay open for 60 seconds so you can inspect.\n');

  await page.goto('https://devonmeadows.com/notes/the-commune-box/', {
    waitUntil: 'networkidle0'
  });

  console.log('Page loaded. Waiting 3 seconds for JS to run...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const info = await page.evaluate(() => {
    const dateEl = document.querySelector('.note-date');
    if (!dateEl) return { found: false };
    return {
      found: true,
      displayText: dateEl.textContent.trim(),
      innerHTML: dateEl.innerHTML,
      dataDate: dateEl.getAttribute('data-date'),
      dataIsUpdated: dateEl.getAttribute('data-is-updated')
    };
  });

  console.log('\n=== WHAT THE BROWSER SEES ===');
  console.log('Display text:', `"${info.displayText}"`);
  console.log('data-date:', info.dataDate);
  console.log('data-is-updated:', info.dataIsUpdated);
  console.log('Inner HTML:', info.innerHTML);

  await page.screenshot({ path: 'scripts/commune-box-date.png', fullPage: true });
  console.log('\nScreenshot saved to: scripts/commune-box-date.png');

  console.log('\nBrowser will stay open for 60 seconds so you can inspect...');
  await new Promise(resolve => setTimeout(resolve, 60000));

  await browser.close();
})();
