const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Loading homepage...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });

  // Wait a bit for any dynamic content
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if the link exists
  const linkExists = await page.evaluate(() => {
    const article = document.querySelector('article.prose');
    const secondPara = article?.querySelectorAll('p')[1];

    const secondParaHTML = secondPara ? secondPara.innerHTML : 'NOT FOUND';
    const secondParaText = secondPara ? secondPara.textContent : 'NOT FOUND';

    const links = Array.from(document.querySelectorAll('a'));
    const manualNoteLink = links.find(a =>
      a.textContent.includes('Manual note refinement') ||
      a.href.includes('manual-note-refinement')
    );

    if (manualNoteLink) {
      return {
        exists: true,
        href: manualNoteLink.href,
        text: manualNoteLink.textContent,
        secondParaHTML,
        secondParaText
      };
    }

    // Also log all wiki-style links to see what's there
    const wikiLinks = links
      .filter(a => a.href.includes('/notes/'))
      .map(a => ({ href: a.href, text: a.textContent.substring(0, 50) }));

    return { exists: false, wikiLinks, secondParaHTML, secondParaText };
  });

  console.log('Link check result:', linkExists);

  // Try to click it if it exists
  if (linkExists.exists) {
    console.log('Attempting to click link...');
    await page.click(`a[href*="manual-note-refinement"]`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Current URL after click:', page.url());
  }

  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
})();
