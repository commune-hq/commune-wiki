const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Loading home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== UPDATED LOGIC VERIFICATION ===\n');

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

  console.log('Date element found:', info.found);
  if (info.found) {
    console.log('\nWhat the user sees:');
    console.log('  Display text:', info.displayText);
    console.log('\nData attributes:');
    console.log('  data-date:', info.dataDate);
    console.log('  data-is-updated:', info.dataIsUpdated);
    console.log('\nFull HTML:');
    console.log('  ', info.outerHTML);

    const shouldShowUpdated = info.dataIsUpdated === 'true';
    const actuallyShowsUpdated = info.displayText.startsWith('Updated');

    console.log('\n=== LOGIC CHECK ===');
    console.log('Should show "Updated"?', shouldShowUpdated);
    console.log('Actually shows "Updated"?', actuallyShowsUpdated);
    console.log('LOGIC CORRECT?', shouldShowUpdated === actuallyShowsUpdated ? '✅ YES' : '❌ NO');
  }

  await browser.close();
})();
