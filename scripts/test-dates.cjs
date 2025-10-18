const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  console.log('\n=== CHECKING DATE DISPLAY ===\n');

  // Check the date display
  const dateInfo = await page.evaluate(() => {
    const dateEl = document.querySelector('.note-date');
    if (!dateEl) return { found: false };

    const dateAttr = dateEl.getAttribute('data-date');
    const displayText = dateEl.textContent;

    // Calculate what it SHOULD say
    const dateString = dateAttr;
    const date = new Date(dateString + 'T12:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = today.getTime() - noteDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let expectedText = '';
    if (diffDays === 0) expectedText = 'Today';
    else if (diffDays === 1) expectedText = 'Yesterday';
    else if (diffDays < 7) expectedText = `${diffDays} days ago`;
    else if (diffDays < 14) expectedText = '1 week ago';
    else if (diffDays < 30) expectedText = `${Math.floor(diffDays / 7)} weeks ago`;
    else if (diffDays < 60) expectedText = '1 month ago';
    else expectedText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      found: true,
      dataDate: dateAttr,
      displayText: displayText,
      expectedText: expectedText,
      matches: displayText === expectedText,
      clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browserNow: now.toISOString(),
      calculatedDiffDays: diffDays,
      noteDateTime: date.toISOString(),
      todayDateTime: today.toISOString()
    };
  });

  console.log('Date element found:', dateInfo.found);
  if (dateInfo.found) {
    console.log('Data attribute (from markdown):', dateInfo.dataDate);
    console.log('Display text (what you see):', dateInfo.displayText);
    console.log('Expected text (what it should be):', dateInfo.expectedText);
    console.log('Matches expected:', dateInfo.matches);
    console.log('\nDebug info:');
    console.log('Client timezone:', dateInfo.clientTimezone);
    console.log('Browser current time:', dateInfo.browserNow);
    console.log('Note date:', dateInfo.noteDateTime);
    console.log('Today (midnight):', dateInfo.todayDateTime);
    console.log('Days difference:', dateInfo.calculatedDiffDays);
  }

  // Also check a few other notes
  console.log('\n=== CHECKING OTHER NOTES ===\n');

  const notesToCheck = [
    '/notes/andy-matuschaks-notes/',
    '/notes/ai-shapes-voice-dumps-into-atomic-notes/',
    '/notes/what-is-commune/'
  ];

  for (const noteUrl of notesToCheck) {
    await page.goto(`https://devonmeadows.com${noteUrl}`, { waitUntil: 'networkidle0' });

    const info = await page.evaluate(() => {
      const dateEl = document.querySelector('.note-date');
      if (!dateEl) return { found: false };

      return {
        found: true,
        dataDate: dateEl.getAttribute('data-date'),
        displayText: dateEl.textContent,
        title: document.querySelector('h1')?.textContent || 'Unknown'
      };
    });

    if (info.found) {
      console.log(`${info.title}:`);
      console.log(`  Data: ${info.dataDate}`);
      console.log(`  Display: ${info.displayText}`);
    }
  }

  await browser.close();
})();
