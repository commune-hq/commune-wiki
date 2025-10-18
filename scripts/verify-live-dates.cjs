const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Loading home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  // Wait a bit for client-side JS to run
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== LIVE SITE CHECK ===\n');

  const info = await page.evaluate(() => {
    const dateEl = document.querySelector('.note-date');
    if (!dateEl) return { found: false };

    // Get all the scripts on the page
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      hasUpdateDateCode: s.textContent.includes('updateRelativeDates')
    }));

    return {
      found: true,
      innerHTML: dateEl.innerHTML,
      textContent: dateEl.textContent,
      dataDate: dateEl.getAttribute('data-date'),
      dataIsUpdated: dateEl.getAttribute('data-is-updated'),
      outerHTML: dateEl.outerHTML,
      parentHTML: dateEl.parentElement.outerHTML.substring(0, 500),
      scripts: scripts.filter(s => s.hasUpdateDateCode)
    };
  });

  console.log('Date element found:', info.found);
  if (info.found) {
    console.log('\nWhat you should see:');
    console.log('Text content:', info.textContent);
    console.log('Inner HTML:', info.innerHTML);
    console.log('\nElement details:');
    console.log('data-date:', info.dataDate);
    console.log('data-is-updated:', info.dataIsUpdated);
    console.log('\nFull element HTML:');
    console.log(info.outerHTML);
    console.log('\nParent context:');
    console.log(info.parentHTML);
    console.log('\nDate update script found:', info.scripts.length > 0);
  }

  // Take a screenshot of the top of the page
  await page.screenshot({
    path: '/Users/devonmeadows/Documents/GitHub/infra-home-server/sites/commune-publish/scripts/live-home-note.png',
    clip: { x: 0, y: 0, width: 1920, height: 600 }
  });
  console.log('\nScreenshot saved to scripts/live-home-note.png');

  await browser.close();
})();
