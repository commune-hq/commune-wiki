/**
 * Puppeteer test for homepage cards on production site
 * Tests both localhost and live site (devonmeadows.com)
 */

const puppeteer = require('puppeteer');

async function testSite(url, siteName) {
  console.log(`\n🔍 Testing ${siteName} (${url})...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });

    // Wait for backlinks script to run
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if cards exist
    const updatesCard = await page.$('.updates-card');
    const backlinksCard = await page.$('.backlinks-card');

    if (!updatesCard || !backlinksCard) {
      throw new Error(`❌ Cards not found on ${siteName}`);
    }
    console.log('✅ Both cards found');

    // Check Updates card title
    const updatesTitle = await page.$eval('.updates-card .card-title', el => el.textContent.trim());
    if (updatesTitle !== 'Updates') {
      throw new Error(`❌ Updates title incorrect on ${siteName}: "${updatesTitle}"`);
    }
    console.log(`✅ Updates title: "${updatesTitle}"`);

    // Check backlinks card title (should NOT have count)
    const backlinksTitle = await page.$eval('.backlinks-card h4', el => el.textContent.trim());
    if (backlinksTitle !== 'Links to this note') {
      throw new Error(`❌ Backlinks title incorrect on ${siteName}: "${backlinksTitle}" (expected "Links to this note")`);
    }
    console.log(`✅ Backlinks title: "${backlinksTitle}" (no count shown)`);

    // Check that backlinks are actually loaded
    const backlinkItems = await page.$$('.backlinks-card .backlinks-list li');
    const backlinkCount = backlinkItems.length;
    console.log(`✅ ${backlinkCount} backlink(s) loaded`);

    if (backlinkCount === 0) {
      console.warn(`⚠️  Warning: No backlinks found (but title is still correct)`);
    }

    await browser.close();
    console.log(`✨ ${siteName} passed all tests!`);
    return true;

  } catch (error) {
    await browser.close();
    console.error(`\n❌ ${siteName} failed:`, error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Testing homepage card titles on localhost and production...\n');

  try {
    // Test localhost first
    await testSite('http://localhost:4321/', 'Localhost');

    // Test live site
    await testSite('https://devonmeadows.com/', 'Production (devonmeadows.com)');

    console.log('\n🎉 All tests passed!');
    console.log('✅ Localhost: Card titles correct');
    console.log('✅ Production: Card titles correct');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  }
}

runTests();
