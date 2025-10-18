const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Loading home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== FULL PAGE VERIFICATION ===\n');

  // Check both date and footer cards
  const verification = await page.evaluate(() => {
    const dateEl = document.querySelector('.note-date');
    const footerSection = document.querySelector('.home-footer-cards');
    const backlinksCard = document.querySelector('.backlinks-card');
    const activityCard = document.querySelector('.activity-card');

    return {
      date: {
        found: !!dateEl,
        text: dateEl?.textContent,
        dataDate: dateEl?.getAttribute('data-date')
      },
      footer: {
        found: !!footerSection,
        display: footerSection ? window.getComputedStyle(footerSection).display : null,
        position: footerSection ? footerSection.getBoundingClientRect() : null
      },
      backlinksCard: {
        found: !!backlinksCard,
        text: backlinksCard?.textContent.substring(0, 100)
      },
      activityCard: {
        found: !!activityCard,
        text: activityCard?.textContent.substring(0, 100)
      }
    };
  });

  console.log('✅ Date display:');
  console.log('   Found:', verification.date.found);
  console.log('   Text:', verification.date.text);
  console.log('   Date:', verification.date.dataDate);

  console.log('\n✅ Footer cards section:');
  console.log('   Found:', verification.footer.found);
  console.log('   Display:', verification.footer.display);
  console.log('   Position:', verification.footer.position);

  console.log('\n✅ Backlinks card:');
  console.log('   Found:', verification.backlinksCard.found);
  console.log('   Preview:', verification.backlinksCard.text);

  console.log('\n✅ Activity card:');
  console.log('   Found:', verification.activityCard.found);
  console.log('   Preview:', verification.activityCard.text);

  // Take full page screenshot
  await page.screenshot({
    path: '/Users/devonmeadows/Documents/GitHub/infra-home-server/sites/commune-publish/scripts/full-page-verification.png',
    fullPage: true
  });
  console.log('\n📸 Full page screenshot saved to scripts/full-page-verification.png');

  await browser.close();
})();
