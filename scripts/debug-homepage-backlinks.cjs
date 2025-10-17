const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('=== DIAGNOSING HOMEPAGE BACKLINKS ===\n');

  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });

  // Wait for backlinks section to exist
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  // Diagnostic information
  const diagnostics = await page.evaluate(() => {
    const section = document.querySelector('.backlinks');
    const list = document.querySelector('.backlinks-list');

    return {
      sectionExists: !!section,
      sectionDataAttribute: section?.dataset?.backlinksFor,
      sectionClasses: section?.className,
      sectionHidden: section?.classList?.contains('hidden'),
      listExists: !!list,
      listChildCount: list?.children?.length || 0,
      listInnerHTML: list?.innerHTML,
      backlinksDataAvailable: typeof window.backlinksData !== 'undefined',
      initFunctionAvailable: typeof window.initializeBacklinks === 'function'
    };
  });

  console.log('Section Info:');
  console.log(`  - Section exists: ${diagnostics.sectionExists}`);
  console.log(`  - data-backlinks-for: "${diagnostics.sectionDataAttribute}"`);
  console.log(`  - Classes: "${diagnostics.sectionClasses}"`);
  console.log(`  - Hidden: ${diagnostics.sectionHidden}`);

  console.log('\nList Info:');
  console.log(`  - List exists: ${diagnostics.listExists}`);
  console.log(`  - Children count: ${diagnostics.listChildCount}`);
  console.log(`  - innerHTML: "${diagnostics.listInnerHTML}"`);

  console.log('\nScript Info:');
  console.log(`  - backlinksData loaded: ${diagnostics.backlinksDataAvailable}`);
  console.log(`  - initializeBacklinks available: ${diagnostics.initFunctionAvailable}`);

  // Check what's in backlinks.json for this slug
  const backlinksJson = await page.evaluate(async () => {
    const res = await fetch('/backlinks.json');
    const data = await res.json();
    const communeData = data['/notes/commune/'];
    return {
      exists: !!communeData,
      inboundCount: communeData?.inbound?.length || 0,
      inbound: communeData?.inbound || []
    };
  });

  console.log('\nBacklinks JSON Data:');
  console.log(`  - Commune entry exists: ${backlinksJson.exists}`);
  console.log(`  - Inbound count: ${backlinksJson.inboundCount}`);
  console.log(`  - Inbound links:`, backlinksJson.inbound);

  await browser.close();
})();
