const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  const notesToCheck = [
    { url: '/notes/my-working-notes/', name: 'My Working Notes' },
    { url: '/notes/andy-matuschaks-notes/', name: 'Andy Matuschak' },
    { url: '/notes/ai-shapes-voice-dumps-into-atomic-notes/', name: 'AI shapes voice' },
    { url: '/notes/what-is-commune/', name: 'Commune' }
  ];

  console.log('\n=== CHECKING CREATED/UPDATED PREFIX ===\n');

  for (const note of notesToCheck) {
    await page.goto(`https://devonmeadows.com${note.url}`, { waitUntil: 'networkidle0' });

    const dateInfo = await page.evaluate(() => {
      const dateEl = document.querySelector('.note-date');
      if (!dateEl) return { found: false };

      return {
        found: true,
        displayText: dateEl.textContent,
        dataDate: dateEl.getAttribute('data-date'),
        isUpdated: dateEl.getAttribute('data-is-updated')
      };
    });

    if (dateInfo.found) {
      console.log(`${note.name}:`);
      console.log(`  Display: "${dateInfo.displayText}"`);
      console.log(`  Date: ${dateInfo.dataDate}`);
      console.log(`  Is updated: ${dateInfo.isUpdated}`);
      console.log();
    }
  }

  await browser.close();
})();
