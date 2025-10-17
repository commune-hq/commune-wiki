const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('=== VALIDATING COMMUNE ALIASING FIX ===\n');

  // Test 1: Homepage loads
  console.log('1. Loading homepage...');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });

  const homepageTitle = await page.$eval('h1', el => el.textContent);
  console.log(`   Homepage title: "${homepageTitle}"`);

  // Test 2: Find and click Commune link from homepage
  console.log('\n2. Finding [[Commune]] link on homepage...');
  const communeLink = await page.$eval('article.prose a[href="/notes/what-is-commune/"]', el => ({
    text: el.textContent,
    href: el.getAttribute('href')
  }));
  console.log(`   Link text: "${communeLink.text}"`);
  console.log(`   Link href: ${communeLink.href}`);

  // Test 3: Click the link and verify destination
  console.log('\n3. Clicking Commune link...');
  await page.click('article.prose a[href="/notes/what-is-commune/"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  const communePageTitle = await page.$eval('h1', el => el.textContent);
  const communePageUrl = page.url();
  console.log(`   Navigated to: ${communePageUrl}`);
  console.log(`   Page title: "${communePageTitle}"`);

  // Test 4: Check that homepage has backlinks now
  console.log('\n4. Checking homepage backlinks...');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  const backlinkInfo = await page.evaluate(() => {
    const section = document.querySelector('.backlinks');
    const list = section?.querySelector('.backlinks-list');
    return {
      sectionHidden: section?.classList?.contains('hidden'),
      linkCount: list?.children?.length || 0,
      links: Array.from(list?.children || []).map(li => li.textContent.trim())
    };
  });

  console.log(`   Section hidden: ${backlinkInfo.sectionHidden}`);
  console.log(`   Backlink count: ${backlinkInfo.linkCount}`);
  if (backlinkInfo.linkCount > 0) {
    console.log(`   Backlinks: ${backlinkInfo.links.join(', ')}`);
  }

  // Summary
  console.log('\n=== VALIDATION RESULTS ===');
  const success =
    homepageTitle === "Devon's working brain in public" &&
    communeLink.href === '/notes/what-is-commune/' &&
    communePageTitle === 'Commune' &&
    !backlinkInfo.sectionHidden &&
    backlinkInfo.linkCount > 0;

  if (success) {
    console.log('✅ All checks passed!');
    console.log('   - Homepage loads correctly');
    console.log('   - [[Commune]] resolves to /notes/what-is-commune/');
    console.log(`   - Commune note has correct title: "${communePageTitle}"`);
    console.log(`   - Homepage has ${backlinkInfo.linkCount} backlinks visible`);
  } else {
    console.log('❌ Some checks failed - review output above');
  }

  await browser.close();
})();
