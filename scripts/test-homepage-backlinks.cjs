const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('Testing missing backlinks on homepage...\n');

  // Test 1: Fresh load
  console.log('1. Fresh page load:');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  let backlinksList = await page.$('.backlinks-list');
  let hasBacklinks = await page.evaluate(el => el && el.children.length > 0, backlinksList);
  console.log(`   Backlinks visible: ${hasBacklinks ? 'YES' : 'NO'}`);

  // Test 2: Click logo
  console.log('\n2. After clicking logo:');
  await page.click('a[href="/"]');
  await page.waitForTimeout(1000);

  backlinksList = await page.$('.backlinks-list');
  hasBacklinks = await page.evaluate(el => el && el.children.length > 0, backlinksList);
  console.log(`   Backlinks visible: ${hasBacklinks ? 'YES' : 'NO'}`);

  // Test 3: Refresh
  console.log('\n3. After page refresh:');
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  backlinksList = await page.$('.backlinks-list');
  hasBacklinks = await page.evaluate(el => el && el.children.length > 0, backlinksList);
  console.log(`   Backlinks visible: ${hasBacklinks ? 'YES' : 'NO'}`);

  await browser.close();
})();
