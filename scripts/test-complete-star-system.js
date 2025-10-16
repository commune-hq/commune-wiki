import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🧪 Testing Complete Star System...\n');

  // Test 1: Verify starred notes in backlinks.json
  console.log('📊 Test 1: Verify backlinks.json has correct starred notes');
  await page.goto('https://devonmeadows.com/backlinks.json');
  const backlinksData = await page.evaluate(() => {
    return JSON.parse(document.body.textContent);
  });

  const starredNotes = Object.entries(backlinksData)
    .filter(([_, note]) => note.isStarred)
    .map(([slug, note]) => ({
      slug,
      title: note.title,
      backlinks: note.inbound.length
    }));

  console.log(`   ✓ Found ${starredNotes.length} starred notes:`);
  starredNotes.forEach(note => console.log(`     - ${note.title} (${note.backlinks} backlinks)`));

  // Test 2: Check header star on a starred note page
  console.log('\n⭐ Test 2: Check header star on "Ask the Brain" page');
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000); // Wait for HeaderStarScript to run

  const headerStar = await page.evaluate(() => {
    const h1 = document.querySelector('.prose h1');
    if (!h1) return null;

    const star = h1.querySelector('.star-indicator');
    if (!star) return null;

    return {
      exists: true,
      text: star.textContent,
      tooltip: star.getAttribute('title'),
      ariaLabel: star.getAttribute('aria-label')
    };
  });

  if (headerStar && headerStar.exists) {
    console.log(`   ✓ Header star found in h1`);
    console.log(`     - Text: "${headerStar.text}"`);
    console.log(`     - Tooltip: "${headerStar.tooltip}"`);
    console.log(`     - ARIA label: "${headerStar.ariaLabel}"`);
  } else {
    console.log(`   ✗ Header star NOT found in h1`);
  }

  // Test 3: Check WikiLinks have stars
  console.log('\n🔗 Test 3: Check WikiLinks have stars (after title)');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const wikiLinkStars = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/notes/"]'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent,
        starAtEnd: link.textContent.trim().endsWith('⭐')
      }));
  });

  console.log(`   ✓ Found ${wikiLinkStars.length} starred WikiLinks:`);
  wikiLinkStars.forEach(link => {
    const position = link.starAtEnd ? '(star at end ✓)' : '(star NOT at end ✗)';
    console.log(`     - ${link.text} ${position}`);
  });

  // Test 4: Check backlinks section
  console.log('\n📑 Test 4: Check backlinks section for stars');
  await page.goto('https://devonmeadows.com/notes/commune/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const backlinksStars = await page.evaluate(() => {
    const backlinksList = document.querySelector('.backlinks-list');
    if (!backlinksList) return [];

    const links = Array.from(backlinksList.querySelectorAll('a'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent,
        starAtEnd: link.textContent.trim().endsWith('⭐')
      }));
  });

  console.log(`   ✓ Found ${backlinksStars.length} starred notes in backlinks:`);
  backlinksStars.forEach(link => {
    const position = link.starAtEnd ? '(star at end ✓)' : '(star NOT at end ✗)';
    console.log(`     - ${link.text} ${position}`);
  });

  // Test 5: Check dynamic pane loading
  console.log('\n🎯 Test 5: Test dynamic pane - click WikiLink and check stars');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);

  // Find a link to click
  const linkToClick = await page.evaluate(() => {
    const link = document.querySelector('a[href^="/notes/"]');
    return link ? link.getAttribute('href') : null;
  });

  const viewportWidth = await page.evaluate(() => window.innerWidth);

  if (linkToClick && viewportWidth >= 1024) {
    console.log(`   Clicking link: ${linkToClick}`);
    await page.click(`a[href="${linkToClick}"]`);
    await wait(2000); // Wait for pane to load and initialize

    const paneStars = await page.evaluate(() => {
      // Get the rightmost pane
      const panes = Array.from(document.querySelectorAll('.pane'));
      const lastPane = panes[panes.length - 1];
      if (!lastPane) return { wikiLinks: [], headerStar: null };

      // Check WikiLinks in pane
      const links = Array.from(lastPane.querySelectorAll('a[href^="/notes/"]'));
      const starredLinks = links
        .filter(link => link.textContent.includes('⭐'))
        .map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent,
          starAtEnd: link.textContent.trim().endsWith('⭐')
        }));

      // Check header star in pane
      const h1 = lastPane.querySelector('.prose h1');
      let headerStar = null;
      if (h1) {
        const star = h1.querySelector('.star-indicator');
        if (star) {
          headerStar = {
            exists: true,
            tooltip: star.getAttribute('title')
          };
        }
      }

      return { wikiLinks: starredLinks, headerStar };
    });

    console.log(`   ✓ Found ${paneStars.wikiLinks.length} starred WikiLinks in dynamic pane`);
    if (paneStars.headerStar) {
      console.log(`   ✓ Header star found in dynamic pane h1`);
    } else {
      console.log(`   - No header star in dynamic pane (note may not be starred)`);
    }
  } else {
    console.log(`   ⊘ Skipped (desktop required or no link found)`);
  }

  // Test 6: Mobile viewport
  console.log('\n📱 Test 6: Mobile viewport - check stars');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const mobileHeaderStar = await page.evaluate(() => {
    const h1 = document.querySelector('.prose h1');
    if (!h1) return null;

    const star = h1.querySelector('.star-indicator');
    return star ? { exists: true, text: star.textContent } : null;
  });

  const mobileWikiLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/notes/"]'));
    return links.filter(link => link.textContent.includes('⭐')).length;
  });

  console.log(`   ✓ Header star on mobile: ${mobileHeaderStar ? 'Found ✓' : 'Not found ✗'}`);
  console.log(`   ✓ Found ${mobileWikiLinks} starred WikiLinks on mobile`);

  // Take screenshots
  console.log('\n📸 Taking screenshots...');

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);
  await page.screenshot({ path: 'scripts/star-system-desktop.png', fullPage: true });
  console.log('   ✓ Desktop screenshot: scripts/star-system-desktop.png');

  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);
  await page.screenshot({ path: 'scripts/star-system-mobile.png', fullPage: true });
  console.log('   ✓ Mobile screenshot: scripts/star-system-mobile.png');

  // Summary
  console.log('\n✅ Complete Star System Test Summary:');
  console.log(`   - Expected 2 starred notes: ${starredNotes.length === 2 ? '✓' : '✗'}`);
  console.log(`   - Header star rendering: ${headerStar ? '✓' : '✗'}`);
  console.log(`   - WikiLink stars (after title): ${wikiLinkStars.every(l => l.starAtEnd) ? '✓' : '✗'}`);
  console.log(`   - Backlinks stars (after title): ${backlinksStars.every(l => l.starAtEnd) ? '✓' : '✗'}`);
  console.log(`   - Mobile rendering: ${mobileHeaderStar ? '✓' : '✗'}`);

  console.log('\n👀 Browser kept open for manual inspection. Press Ctrl+C to close.');
})();
