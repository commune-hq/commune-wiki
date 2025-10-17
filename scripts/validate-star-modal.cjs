const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('=== VALIDATING STAR MODAL LANGUAGE ===\n');

  // Navigate to a starred note (Voice in, approvals out is starred)
  await page.goto('https://devonmeadows.com/notes/voice-in-approvals-out/', { waitUntil: 'networkidle2' });

  console.log('1. Checking star indicator is present...');
  const starExists = await page.$('.star-indicator');
  console.log(`   Star indicator found: ${!!starExists}`);

  if (!starExists) {
    console.log('\n❌ Star not found - cannot test modal');
    await browser.close();
    return;
  }

  console.log('\n2. Clicking star to open modal...');
  await page.click('.star-indicator');
  await new Promise(resolve => setTimeout(resolve, 500));

  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    const isVisible = modal && modal.style.display === 'flex';

    if (!isVisible) return { visible: false };

    const title = modal.querySelector('h2')?.textContent || '';
    const paragraphs = Array.from(modal.querySelectorAll('p')).map(p => p.textContent.trim());
    const fullText = [title, ...paragraphs].join(' ');

    return {
      visible: true,
      title: title,
      body: paragraphs[0] || '',
      link: paragraphs[1] || '',
      hasBacklinks: fullText.toLowerCase().includes('backlink'),
      hasKnowledgeGraph: fullText.toLowerCase().includes('knowledge graph'),
      hasHyphen: title.includes('-') || title.includes('–')
    };
  });

  console.log(`   Modal visible: ${modalInfo.visible}`);

  if (modalInfo.visible) {
    console.log(`\n3. Modal content:`);
    console.log(`   Title: "${modalInfo.title}"`);
    console.log(`   Body: "${modalInfo.body}"`);
    console.log(`   Link: "${modalInfo.link}"`);

    console.log(`\n4. Language checks:`);
    console.log(`   Contains "backlinks": ${modalInfo.hasBacklinks ? '❌ FOUND' : '✅ NOT FOUND'}`);
    console.log(`   Contains "knowledge graph": ${modalInfo.hasKnowledgeGraph ? '❌ FOUND' : '✅ NOT FOUND'}`);
    console.log(`   Contains hyphen in title: ${modalInfo.hasHyphen ? '❌ FOUND' : '✅ NOT FOUND'}`);

    console.log('\n=== VALIDATION RESULTS ===');
    if (
      modalInfo.title === 'Top 5%' &&
      !modalInfo.hasBacklinks &&
      !modalInfo.hasKnowledgeGraph &&
      !modalInfo.hasHyphen
    ) {
      console.log('✅ All checks passed!');
      console.log('   - Title simplified to "Top 5%"');
      console.log('   - No technical jargon (backlinks, knowledge graph)');
      console.log('   - No hyphens');
      console.log('   - Language is brief and direct');
    } else {
      console.log('❌ Some checks failed - review above');
    }
  }

  await browser.close();
})();
