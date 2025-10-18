const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Verifying Google Rich Results schema on live site...\n');

  // Test homepage
  console.log('=== HOMEPAGE (devonmeadows.com) ===');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const homeSchema = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return null;
    return JSON.parse(script.textContent);
  });

  if (homeSchema && homeSchema['@graph']) {
    const article = homeSchema['@graph'].find(item => item['@type'] === 'Article');
    if (article) {
      console.log('✓ Article schema found');
      console.log('  Image:', article.image || '❌ MISSING');
      console.log('  Headline:', article.headline);
      console.log('  DateModified:', article.dateModified);
    } else {
      console.log('❌ Article schema NOT found in @graph');
    }
  } else {
    console.log('❌ No JSON-LD schema found');
  }

  // Test note page
  console.log('\n=== NOTE PAGE (my-working-notes) ===');
  await page.goto('https://devonmeadows.com/notes/my-working-notes/', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const noteSchema = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return null;
    return JSON.parse(script.textContent);
  });

  if (noteSchema && noteSchema['@graph']) {
    const article = noteSchema['@graph'].find(item => item['@type'] === 'Article');
    if (article) {
      console.log('✓ Article schema found');
      console.log('  Image:', article.image || '❌ MISSING');
      console.log('  Headline:', article.headline);
      console.log('  DateModified:', article.dateModified);
    } else {
      console.log('❌ Article schema NOT found in @graph');
    }
  } else {
    console.log('❌ No JSON-LD schema found');
  }

  console.log('\n📊 Summary:');
  console.log('Both pages should show Article schema with image field.');
  console.log('Next step: Test URLs in Google Rich Results Test');
  console.log('  Homepage: https://search.google.com/test/rich-results?url=https://devonmeadows.com/');
  console.log('  Note: https://search.google.com/test/rich-results?url=https://devonmeadows.com/notes/my-working-notes/');

  await browser.close();
})();
