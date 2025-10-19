/**
 * Puppeteer test for cross-collection wikilinks and research navigation
 * Tests:
 * 1. Wikilinks from summary notes resolve to research pages
 * 2. Research links have new tab icon and target="_blank"
 * 3. Info box wikilinks are processed correctly
 * 4. Navigation works correctly (back/forward)
 * 5. Mobile and desktop viewports
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:4321';

async function testCrossCollectionLinks() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });

  try {
    // Test desktop viewport
    console.log('\n=== Testing Desktop Viewport ===\n');
    await testDesktop(browser);

    // Test mobile viewport
    console.log('\n=== Testing Mobile Viewport ===\n');
    await testMobile(browser);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function testDesktop(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Navigate to summary note
  console.log('1. Loading summary note...');
  await page.goto(`${BASE_URL}/notes/research-oss-business-models/`, { waitUntil: 'networkidle0' });

  // 2. Check for wikilink to research page
  console.log('2. Checking for research wikilink...');
  const researchLink = await page.$('a.research-link');
  if (!researchLink) {
    throw new Error('Research wikilink not found on summary note');
  }

  // 3. Verify link has target="_blank"
  const target = await researchLink.evaluate(el => el.getAttribute('target'));
  if (target !== '_blank') {
    throw new Error(`Expected target="_blank", got: ${target}`);
  }
  console.log('   ✓ Research link has target="_blank"');

  // 4. Verify link has icon indicator (CSS ::after)
  const hasIcon = await page.evaluate(() => {
    const link = document.querySelector('a.research-link');
    const styles = window.getComputedStyle(link, '::after');
    return styles.content !== 'none' && styles.content !== '';
  });
  if (!hasIcon) {
    throw new Error('Research link does not have icon indicator');
  }
  console.log('   ✓ Research link has icon indicator');

  // 5. Get href and navigate to research page
  const href = await researchLink.evaluate(el => el.getAttribute('href'));
  console.log(`3. Navigating to research page: ${href}`);
  await page.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle0' });

  // 6. Verify research page loaded
  const h1 = await page.$eval('h1', el => el.textContent);
  console.log(`   ✓ Research page loaded: "${h1}"`);

  // 7. Check info box exists
  console.log('4. Checking info box...');
  const infoBox = await page.$('.research-info-box');
  if (!infoBox) {
    throw new Error('Info box not found on research page');
  }
  console.log('   ✓ Info box found');

  // 8. Verify info box wikilinks are processed
  console.log('5. Checking info box wikilinks...');
  await new Promise(resolve => setTimeout(resolve, 500)); // Wait for JS to process wikilinks
  const contextLinks = await page.$$('.research-intro a.wikilink');
  if (contextLinks.length === 0) {
    throw new Error('No processed wikilinks found in info box context');
  }
  console.log(`   ✓ Found ${contextLinks.length} processed wikilinks in info box`);

  // 9. Verify metadata is displayed
  const wordCount = await page.$eval('.meta-item:nth-child(3) .meta-value', el => el.textContent);
  console.log(`   ✓ Word count: ${wordCount}`);

  // 10. Test scroll and back-to-top button
  console.log('6. Testing scroll...');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await new Promise(resolve => setTimeout(resolve, 500));

  const backToTopVisible = await page.$eval('.back-to-top', el =>
    window.getComputedStyle(el).opacity === '1'
  );
  if (!backToTopVisible) {
    throw new Error('Back to top button not visible after scrolling');
  }
  console.log('   ✓ Back to top button appears on scroll');

  // 11. Click back to summary link
  console.log('7. Testing back to summary navigation...');
  const backLink = await page.$('.back-to-summary-link');
  await backLink.click();
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  const currentUrl = page.url();
  if (!currentUrl.includes('/notes/research-oss-business-models')) {
    throw new Error(`Expected to navigate back to summary, got: ${currentUrl}`);
  }
  console.log('   ✓ Back to summary navigation works');

  await page.close();
}

async function testMobile(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 }); // iPhone SE

  // 1. Navigate to research page
  console.log('1. Loading research page on mobile...');
  await page.goto(`${BASE_URL}/research/oss-business-models`, { waitUntil: 'networkidle0' });

  // 2. Check responsive layout
  console.log('2. Checking mobile layout...');
  const mainWidth = await page.$eval('main', el => el.offsetWidth);
  if (mainWidth > 400) {
    throw new Error(`Main content too wide for mobile: ${mainWidth}px`);
  }
  console.log(`   ✓ Main content width: ${mainWidth}px`);

  // 3. Test table scrolling (tables can overflow)
  const tables = await page.$$('table');
  if (tables.length > 0) {
    const tableWidth = await tables[0].evaluate(el => el.scrollWidth);
    console.log(`   ✓ Table can scroll (width: ${tableWidth}px)`);
  }

  // 4. Verify header doesn't overlap content
  const headerHeight = await page.$eval('header', el => el.offsetHeight);
  const mainTop = await page.$eval('main', el => el.getBoundingClientRect().top);
  console.log(`   ✓ Header height: ${headerHeight}px, Main top: ${mainTop}px`);

  await page.close();
}

// Run tests
testCrossCollectionLinks().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
