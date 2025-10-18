const puppeteer = require('puppeteer');

(async () => {
  // Launch with visible browser
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  });
  const page = await browser.newPage();

  // Set mobile viewport and user agent
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  console.log('Opening home note in visible browser...');
  console.log('You should see Chrome open now.\n');

  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  console.log('Page loaded. Waiting 3 seconds for JS to run...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const info = await page.evaluate(() => {
    const dateEl = document.querySelector('.note-date');
    if (!dateEl) return { found: false };

    return {
      found: true,
      displayText: dateEl.textContent,
      innerHTML: dateEl.innerHTML,
      dataDate: dateEl.getAttribute('data-date'),
      dataIsUpdated: dateEl.getAttribute('data-is-updated'),
      outerHTML: dateEl.outerHTML
    };
  });

  console.log('\n=== WHAT THE BROWSER SEES ===');
  console.log('Date element found:', info.found);
  if (info.found) {
    console.log('Display text:', `"${info.displayText}"`);
    console.log('data-date:', info.dataDate);
    console.log('data-is-updated:', info.dataIsUpdated);
    console.log('\nFull HTML:');
    console.log(info.outerHTML);
  }

  console.log('\nBrowser will stay open for 30 seconds so you can inspect it...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
})();
