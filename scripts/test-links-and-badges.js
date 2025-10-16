import puppeteer from 'puppeteer';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLinksAndBadges() {
  console.log('🔍 Testing Links to this note and LIVE badge visibility...\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Test 1: Homepage - check for links section
    console.log('Test 1: Loading homepage...');
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    let linksText = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Links to this note'));
      if (!heading) return null;
      return heading.textContent;
    });
    console.log(`  ├─ Links section visible: ${linksText ? 'YES' : 'NO'}`);

    let badgeText = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent.trim() === 'LIVE' &&
        el.children.length === 0 &&
        window.getComputedStyle(el).display !== 'none'
      );
      return badges.length > 0 ? 'LIVE' : null;
    });
    console.log(`  └─ LIVE badge visible: ${badgeText ? 'YES' : 'NO'}\n`);

    // Test 2: Click link from homepage - check pane behavior
    console.log('Test 2: Clicking "Ledger replaces feeds" from homepage...');
    const ledgerLink = await page.waitForSelector('a[href*="ledger-replaces-feeds"]');
    await ledgerLink.click();
    await sleep(1500);

    linksText = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Links to this note'));
      if (!heading) return null;
      return heading.textContent;
    });
    console.log(`  ├─ Links section visible after click: ${linksText ? 'YES' : 'NO'}`);

    badgeText = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent.trim() === 'LIVE' &&
        el.children.length === 0 &&
        window.getComputedStyle(el).display !== 'none'
      );
      return badges.length > 0 ? 'LIVE' : null;
    });
    console.log(`  └─ LIVE badge visible after click: ${badgeText ? 'YES' : 'NO'}\n`);

    // Test 3: Direct navigation to note page
    console.log('Test 3: Direct navigation to /notes/ledger-replaces-feeds/...');
    await page.goto('https://devonmeadows.com/notes/ledger-replaces-feeds/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    linksText = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Links to this note'));
      if (!heading) return null;
      // Get next element to see if there are actual links
      const nextEl = heading.nextElementSibling;
      const hasLinks = nextEl && (nextEl.tagName === 'UL' || nextEl.querySelector('a'));
      return { heading: heading.textContent, hasLinks };
    });
    console.log(`  ├─ Links section visible: ${linksText ? 'YES' : 'NO'}`);
    if (linksText) {
      console.log(`  ├─ Has actual links: ${linksText.hasLinks ? 'YES' : 'NO'}`);
    }

    badgeText = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent.trim() === 'LIVE' &&
        el.children.length === 0 &&
        window.getComputedStyle(el).display !== 'none'
      );
      return badges.length > 0 ? 'LIVE' : null;
    });
    console.log(`  └─ LIVE badge visible: ${badgeText ? 'YES' : 'NO'}\n`);

    // Test 4: Click another link from here - check pane behavior
    console.log('Test 4: Clicking another link from the note page...');
    const anotherLink = await page.waitForSelector('a[href*="auto-essay"]');
    await anotherLink.click();
    await sleep(1500);

    linksText = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Links to this note'));
      if (!heading) return null;
      return heading.textContent;
    });
    console.log(`  ├─ Links section visible in new pane: ${linksText ? 'YES' : 'NO'}`);

    badgeText = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent.trim() === 'LIVE' &&
        el.children.length === 0 &&
        window.getComputedStyle(el).display !== 'none'
      );
      return badges.length > 0 ? 'LIVE' : null;
    });
    console.log(`  └─ LIVE badge visible in new pane: ${badgeText ? 'YES' : 'NO'}\n`);

    // Test 5: Check page with no backlinks
    console.log('Test 5: Checking page with no backlinks...');
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    const linksHeading = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h =>
        h.textContent.includes('Links to this note')
      );
      if (!heading) return { exists: false };

      // Check what comes after
      let nextEl = heading.nextElementSibling;
      let hasContent = false;

      while (nextEl && !nextEl.matches('h1, h2, h3')) {
        if (nextEl.textContent.trim() && nextEl.textContent.trim() !== 'No backlinks yet.') {
          hasContent = true;
          break;
        }
        if (nextEl.textContent.includes('No backlinks yet.')) {
          return { exists: true, empty: true, hasEmptyMessage: true };
        }
        nextEl = nextEl.nextElementSibling;
      }

      return { exists: true, empty: !hasContent, hasEmptyMessage: false };
    });

    console.log(`  ├─ "Links to this note" heading exists: ${linksHeading.exists ? 'YES' : 'NO'}`);
    if (linksHeading.exists) {
      console.log(`  ├─ Has content: ${!linksHeading.empty ? 'YES' : 'NO'}`);
      console.log(`  └─ Shows "No backlinks yet": ${linksHeading.hasEmptyMessage ? 'YES' : 'NO'}`);
    }

    console.log('\n✅ Testing complete. Browser will close in 3 seconds...');
    await sleep(3000);

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testLinksAndBadges().catch(console.error);
