const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to home note...');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', {
    waitUntil: 'networkidle0'
  });

  console.log('Page loaded. Checking for footer cards...');

  // Check if footer cards section exists
  const footerCardsSection = await page.$('.home-footer-cards');
  console.log('Footer cards section found:', !!footerCardsSection);

  // Check if individual cards exist
  const backlinksCard = await page.$('.backlinks-card');
  console.log('Backlinks card found:', !!backlinksCard);

  const activityCard = await page.$('.activity-card');
  console.log('Activity card found:', !!activityCard);

  // Get the page HTML to check structure
  const bodyHTML = await page.evaluate(() => {
    const paneContent = document.querySelector('.pane-content');
    return paneContent ? paneContent.innerHTML : 'No pane-content found';
  });

  // Check if footer cards HTML is in the page
  const hasFooterCardsHTML = bodyHTML.includes('home-footer-cards');
  console.log('Footer cards HTML in page:', hasFooterCardsHTML);

  // Take screenshot
  await page.screenshot({
    path: 'scripts/footer-cards-test.png',
    fullPage: true
  });
  console.log('Screenshot saved to scripts/footer-cards-test.png');

  // Log any console errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Check the slug being passed
  const slug = await page.evaluate(() => {
    return window.location.pathname;
  });
  console.log('Current page slug:', slug);

  await browser.close();
})();
