const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  console.log('\n=== CHECKING FOOTER CARDS VISIBILITY ===\n');

  // Check visibility and styling
  const cardInfo = await page.evaluate(() => {
    const section = document.querySelector('.home-footer-cards');
    if (!section) return { found: false };

    const computedStyle = window.getComputedStyle(section);
    const rect = section.getBoundingClientRect();

    const backlinksCard = document.querySelector('.backlinks-card');
    const activityCard = document.querySelector('.activity-card');

    return {
      found: true,
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      height: computedStyle.height,
      position: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      },
      backlinksCard: backlinksCard ? {
        text: backlinksCard.textContent.substring(0, 100),
        display: window.getComputedStyle(backlinksCard).display
      } : null,
      activityCard: activityCard ? {
        text: activityCard.textContent.substring(0, 100),
        display: window.getComputedStyle(activityCard).display
      } : null,
      innerHTML: section.innerHTML.substring(0, 300)
    };
  });

  console.log('Footer cards found:', cardInfo.found);
  if (cardInfo.found) {
    console.log('Display:', cardInfo.display);
    console.log('Visibility:', cardInfo.visibility);
    console.log('Opacity:', cardInfo.opacity);
    console.log('Height:', cardInfo.height);
    console.log('Position:', cardInfo.position);
    console.log('\nBacklinks card:', cardInfo.backlinksCard);
    console.log('\nActivity card:', cardInfo.activityCard);
    console.log('\nFirst 300 chars of HTML:', cardInfo.innerHTML);
  }

  await browser.close();
})();
