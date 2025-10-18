const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile user agent
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  console.log('Testing with mobile user agent...\n');

  const notes = [
    { url: 'https://devonmeadows.com/notes/my-working-notes/', name: 'Home note' },
    { url: 'https://devonmeadows.com/notes/what-is-commune/', name: 'Commune' },
    { url: 'https://devonmeadows.com/notes/evergreen-notes/', name: 'Evergreen' }
  ];

  for (const note of notes) {
    await page.goto(note.url, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const info = await page.evaluate(() => {
      const dateEl = document.querySelector('.note-date');
      if (!dateEl) return { found: false };
      return {
        found: true,
        displayText: dateEl.textContent,
        dataDate: dateEl.getAttribute('data-date'),
        dataIsUpdated: dateEl.getAttribute('data-is-updated')
      };
    });

    console.log(`${note.name}:`);
    if (info.found) {
      console.log(`  Display: "${info.displayText}"`);
      console.log(`  data-date: ${info.dataDate}`);
      console.log(`  data-is-updated: ${info.dataIsUpdated}`);
    } else {
      console.log('  Date element not found');
    }
    console.log();
  }

  await browser.close();
})();
