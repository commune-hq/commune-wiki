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

  // Take screenshot of just the top portion showing the date
  await page.screenshot({
    path: '/Users/devonmeadows/Documents/GitHub/infra-home-server/sites/commune-publish/scripts/home-note-date-proof.png',
    clip: { x: 0, y: 0, width: 1920, height: 400 }
  });

  console.log('✅ Screenshot saved to scripts/home-note-date-proof.png');

  await browser.close();
})();
