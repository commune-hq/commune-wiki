const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('=== VALIDATING COMMUNE NOTE BACKLINKS ===\n');

  await page.goto('https://devonmeadows.com/notes/what-is-commune/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  const noteInfo = await page.evaluate(() => {
    const title = document.querySelector('h1')?.textContent;
    const section = document.querySelector('.backlinks');
    const list = section?.querySelector('.backlinks-list');
    const heading = section?.querySelector('h4')?.textContent;

    return {
      title: title,
      sectionHidden: section?.classList?.contains('hidden'),
      headingText: heading,
      linkCount: list?.children?.length || 0,
      links: Array.from(list?.children || []).map(li => {
        const text = li.textContent.trim();
        const starCount = (text.match(/⭐/g) || []).length;
        return { text, hasR: starCount > 0 };
      })
    };
  });

  console.log(`Note title: "${noteInfo.title}"`);
  console.log(`\nBacklinks section:`);
  console.log(`  Hidden: ${noteInfo.sectionHidden}`);
  console.log(`  Heading: "${noteInfo.headingText}"`);
  console.log(`  Count: ${noteInfo.linkCount}`);

  if (noteInfo.linkCount > 0) {
    console.log(`\nBacklinks:`);
    noteInfo.links.forEach((link, i) => {
      const star = link.hasStar ? ' ⭐' : '';
      console.log(`  ${i + 1}. ${link.text}${star}`);
    });
  }

  console.log('\n=== VALIDATION RESULTS ===');
  if (noteInfo.title === 'Commune' && !noteInfo.sectionHidden && noteInfo.linkCount > 0) {
    console.log('✅ All checks passed!');
    console.log(`   - Commune note has correct title`);
    console.log(`   - Backlinks section is visible`);
    console.log(`   - ${noteInfo.linkCount} backlinks showing`);
  } else {
    console.log('❌ Some checks failed');
  }

  await browser.close();
})();
