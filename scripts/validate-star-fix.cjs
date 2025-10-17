const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewport({ width: 375, height: 667 });

  // Navigate to the page
  await page.goto('https://devonmeadows.com/notes/discovery-runs-on-time-follows-and-why/', { waitUntil: 'networkidle2' });

  // Wait for backlinks section
  await page.waitForSelector('.backlinks', { timeout: 5000 });

  // Get all backlink items with stars
  const backlinkItems = await page.evaluate(() => {
    const items = [];
    const backlinksSection = document.querySelector('.backlinks');
    if (backlinksSection) {
      const links = backlinksSection.querySelectorAll('li');
      links.forEach(li => {
        const text = li.textContent.trim();
        const starCount = (text.match(/⭐/g) || []).length;
        items.push({
          text: text,
          starCount: starCount
        });
      });
    }
    return items;
  });

  console.log('✓ Deployed fix validation:\n');
  console.log('Backlink items:');
  backlinkItems.forEach(item => {
    const status = item.starCount === 1 ? '✓' : (item.starCount > 1 ? '✗ DOUBLE STAR BUG' : '');
    const plural = item.starCount !== 1 ? 's' : '';
    console.log(`  ${status} ${item.text} (${item.starCount} star${plural})`);
  });

  await browser.close();
})();
