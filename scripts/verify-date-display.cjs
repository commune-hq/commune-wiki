const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Checking date display on multiple notes...\n');

  const notes = [
    { url: 'https://devonmeadows.com/', name: 'Home (root)', expectedDate: '2025-10-18' },
    { url: 'https://devonmeadows.com/notes/my-working-notes/', name: 'Home note', expectedDate: '2025-10-18' },
    { url: 'https://devonmeadows.com/notes/the-commune-box/', name: 'Commune box', expectedDate: '2025-10-18' },
    { url: 'https://devonmeadows.com/notes/what-is-commune/', name: 'Commune', expectedDate: '2025-10-16' },
    { url: 'https://devonmeadows.com/notes/awake-happy/', name: 'Awake Happy', expectedDate: '2025-10-16' }
  ];

  for (const note of notes) {
    await page.goto(note.url, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const info = await page.evaluate(() => {
      const dateEl = document.querySelector('.note-date');
      if (!dateEl) return { found: false };
      return {
        found: true,
        displayText: dateEl.textContent.trim(),
        dataDate: dateEl.getAttribute('data-date'),
        dataIsUpdated: dateEl.getAttribute('data-is-updated'),
        outerHTML: dateEl.outerHTML
      };
    });

    console.log(`=== ${note.name} ===`);
    console.log(`Expected date: ${note.expectedDate}`);
    if (info.found) {
      console.log(`Display text: "${info.displayText}"`);
      console.log(`data-date: ${info.dataDate}`);
      console.log(`data-is-updated: ${info.dataIsUpdated}`);

      // Check if it's showing relative time or actual date
      const isRelative = info.displayText.includes('today') ||
                         info.displayText.includes('yesterday') ||
                         info.displayText.includes('ago');
      console.log(`Is relative: ${isRelative ? 'YES' : 'NO (showing actual date!)'}`);
    } else {
      console.log('Date element not found');
    }
    console.log();
  }

  await browser.close();
})();
