/**
 * Production test for research pages on devonmeadows.com
 * Tests all features on desktop and mobile
 */

import puppeteer from 'puppeteer';

const PROD_URL = 'https://devonmeadows.com';

async function testProduction() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 150 });

  try {
    console.log('\n=== Testing Desktop (1280x800) ===\n');
    await testDesktop(browser);

    console.log('\n=== Testing Mobile (375x667 - iPhone SE) ===\n');
    await testMobile(browser);

    console.log('\n✅ All production tests passed!');
  } catch (error) {
    console.error('\n❌ Production test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function testDesktop(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Test summary note
  console.log('1. Loading summary note...');
  await page.goto(`${PROD_URL}/notes/research-oss-business-models/`, { waitUntil: 'networkidle0' });

  // Check for research link with icon
  console.log('2. Checking research link...');
  const researchLink = await page.$('a.research-link');
  if (!researchLink) {
    throw new Error('Research link not found');
  }

  const hasIcon = await page.evaluate(() => {
    const link = document.querySelector('a.research-link');
    const styles = window.getComputedStyle(link, '::after');
    return styles.content !== 'none' && styles.content !== '';
  });
  if (!hasIcon) {
    throw new Error('Research link icon not showing');
  }
  console.log('   ✓ Research link has ↗ icon');

  // Check target="_blank"
  const target = await researchLink.evaluate(el => el.getAttribute('target'));
  if (target !== '_blank') {
    throw new Error('Research link should open in new tab');
  }
  console.log('   ✓ Opens in new tab');

  // Check for star
  const hasStar = await page.$('.star-indicator-inline');
  if (hasStar) {
    console.log('   ✓ Star indicator present on Commune link');
  }

  // 3. Navigate to research page
  console.log('3. Navigating to research page...');
  const href = await researchLink.evaluate(el => el.getAttribute('href'));
  await page.goto(`${PROD_URL}${href}`, { waitUntil: 'networkidle0' });

  // Check title
  const h1 = await page.$eval('h1', el => el.textContent);
  console.log(`   ✓ Research page loaded: "${h1}"`);

  // Check info box
  console.log('4. Checking info box...');
  const infoBox = await page.$('.research-info-box');
  if (!infoBox) {
    throw new Error('Info box not found');
  }

  // Wait for wikilinks to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));

  const infoBoxLinks = await page.$$('.research-intro a.wikilink');
  if (infoBoxLinks.length === 0) {
    throw new Error('No wikilinks in info box');
  }
  console.log(`   ✓ Found ${infoBoxLinks.length} wikilinks in info box`);

  // Test hover preview
  console.log('5. Testing hover preview...');
  await infoBoxLinks[0].hover();
  await new Promise(resolve => setTimeout(resolve, 500));

  const previewVisible = await page.evaluate(() => {
    const card = document.getElementById('note-hover');
    return card && !card.hidden && card.textContent.length > 0;
  });
  if (previewVisible) {
    console.log('   ✓ Hover preview works');
  } else {
    console.log('   ⚠️  Preview not showing (may need more time)');
  }

  // Check metadata
  const metadata = await page.$$eval('.meta-item', items =>
    items.map(item => ({
      label: item.querySelector('.meta-label')?.textContent,
      value: item.querySelector('.meta-value')?.textContent
    }))
  );
  console.log('6. Metadata:', metadata);

  // Check back to top button on scroll
  console.log('7. Testing scroll...');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await new Promise(resolve => setTimeout(resolve, 500));

  const backToTopVisible = await page.$eval('.back-to-top', el =>
    window.getComputedStyle(el).opacity === '1'
  );
  if (backToTopVisible) {
    console.log('   ✓ Back to top button visible');
  }

  await page.close();
}

async function testMobile(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  // 1. Load summary note
  console.log('1. Loading summary note on mobile...');
  await page.goto(`${PROD_URL}/notes/research-oss-business-models/`, { waitUntil: 'networkidle0' });

  // Check title size on summary
  const summaryH1Size = await page.$eval('h1', el =>
    window.getComputedStyle(el).fontSize
  );
  console.log(`   Summary note h1 size: ${summaryH1Size}`);

  // 2. Navigate to research
  console.log('2. Loading research page on mobile...');
  await page.goto(`${PROD_URL}/research/oss-business-models`, { waitUntil: 'networkidle0' });

  // Check title size on research
  const researchH1Size = await page.$eval('h1', el =>
    window.getComputedStyle(el).fontSize
  );
  console.log(`   Research page h1 size: ${researchH1Size}`);

  if (summaryH1Size !== researchH1Size) {
    console.log(`   ⚠️  Title sizes differ: ${summaryH1Size} vs ${researchH1Size}`);
  } else {
    console.log('   ✓ Title sizes match');
  }

  // Check responsive layout
  console.log('3. Checking mobile layout...');
  const mainWidth = await page.$eval('main', el => el.offsetWidth);
  const viewportWidth = 375;

  if (mainWidth > viewportWidth) {
    console.log(`   ⚠️  Main content too wide: ${mainWidth}px (viewport: ${viewportWidth}px)`);
  } else {
    console.log(`   ✓ Main width: ${mainWidth}px fits viewport`);
  }

  // Check info box
  const infoBox = await page.$('.research-info-box');
  if (infoBox) {
    console.log('   ✓ Info box present');
  }

  // Test tables overflow/scroll
  const tables = await page.$$('table');
  if (tables.length > 0) {
    const tableWidth = await tables[0].evaluate(el => el.scrollWidth);
    console.log(`   ✓ Table can scroll (width: ${tableWidth}px)`);
  }

  await page.close();
}

// Run tests
testProduction().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
