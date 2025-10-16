import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Test a page that has backlinks (Evergreen Notes has several)
  await page.goto('https://www.devonmeadows.com/notes/evergreen-notes/', { waitUntil: 'networkidle0' });

  // Wait for backlinks to load
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  // Get the backlinks heading text
  const headingText = await page.$eval('.backlinks h4', el => el.textContent);
  console.log('Backlinks heading text:', headingText);

  // Get the number of backlink items
  const backlinkCount = await page.$$eval('.backlinks-list li', items => items.length);
  console.log('Actual backlink count:', backlinkCount);

  // Check if heading includes count
  if (headingText.includes('link')) {
    console.log('✅ Heading includes count');
  } else {
    console.log('❌ Heading does NOT include count');
  }

  // Take screenshot
  await page.screenshot({ path: 'scripts/backlinks-count-test.png', fullPage: true });
  console.log('Screenshot saved to scripts/backlinks-count-test.png');

  await browser.close();
})();
