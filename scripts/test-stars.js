import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🧪 Testing Star System...\n');

  // Test 1: Navigate to homepage and check for stars
  console.log('📱 Test 1: Homepage - Check WikiLinks for stars');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000); // Wait for StarredLinksScript to run

  // Look for starred links on the homepage
  const homeStarredLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/notes/"]'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent
      }));
  });

  console.log(`   Found ${homeStarredLinks.length} starred links on homepage:`);
  homeStarredLinks.forEach(link => console.log(`   - ${link.text}`));

  // Test 2: Navigate to a note with starred links
  console.log('\n📝 Test 2: Note page - Check WikiLinks for stars');
  await page.goto('https://devonmeadows.com/notes/commune/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const noteStarredLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/notes/"]'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent
      }));
  });

  console.log(`   Found ${noteStarredLinks.length} starred links on note page:`);
  noteStarredLinks.forEach(link => console.log(`   - ${link.text}`));

  // Test 3: Check backlinks section for stars
  console.log('\n🔗 Test 3: Backlinks section - Check for stars');
  const backlinksStars = await page.evaluate(() => {
    const backlinksList = document.querySelector('.backlinks-list');
    if (!backlinksList) return [];

    const links = Array.from(backlinksList.querySelectorAll('a'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent
      }));
  });

  console.log(`   Found ${backlinksStars.length} starred notes in backlinks:`);
  backlinksStars.forEach(link => console.log(`   - ${link.text}`));

  // Test 4: Click a WikiLink to open dynamic pane and check stars
  console.log('\n🎯 Test 4: Dynamic pane - Check stars after clicking WikiLink');

  // Find a link to click
  const linkToClick = await page.evaluate(() => {
    const link = document.querySelector('a[href^="/notes/"]');
    return link ? link.getAttribute('href') : null;
  });

  if (linkToClick) {
    console.log(`   Clicking link: ${linkToClick}`);
    await page.click(`a[href="${linkToClick}"]`);
    await wait(2000); // Wait for pane to load and initialize

    const paneStars = await page.evaluate(() => {
      // Get the rightmost pane
      const panes = Array.from(document.querySelectorAll('.pane'));
      const lastPane = panes[panes.length - 1];
      if (!lastPane) return [];

      const links = Array.from(lastPane.querySelectorAll('a[href^="/notes/"]'));
      return links
        .filter(link => link.textContent.includes('⭐'))
        .map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent
        }));
    });

    console.log(`   Found ${paneStars.length} starred links in dynamic pane:`);
    paneStars.forEach(link => console.log(`   - ${link.text}`));
  }

  // Test 5: Mobile viewport
  console.log('\n📱 Test 5: Mobile viewport - Check stars');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const mobileStarredLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/notes/"]'));
    return links
      .filter(link => link.textContent.includes('⭐'))
      .map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent
      }));
  });

  console.log(`   Found ${mobileStarredLinks.length} starred links on mobile:`);
  mobileStarredLinks.forEach(link => console.log(`   - ${link.text}`));

  // Test 6: Check backlinks.json directly
  console.log('\n📊 Test 6: Verify backlinks.json has isStarred metadata');
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

  console.log(`   Found ${starredNotes.length} notes marked as starred in backlinks.json:`);
  starredNotes.forEach(note => console.log(`   - ${note.title} (${note.backlinks} backlinks)`));

  // Take screenshots
  console.log('\n📸 Taking screenshots...');

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);
  await page.screenshot({ path: 'scripts/stars-desktop.png', fullPage: true });
  console.log('   ✓ Desktop screenshot saved: scripts/stars-desktop.png');

  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);
  await page.screenshot({ path: 'scripts/stars-mobile.png', fullPage: true });
  console.log('   ✓ Mobile screenshot saved: scripts/stars-mobile.png');

  console.log('\n✅ Star system testing complete!');
  console.log('\n📝 Summary:');
  console.log(`   - Expected 2 starred notes: "Ask the Brain" and "Voice in, approvals out"`);
  console.log(`   - Found ${starredNotes.length} starred notes in backlinks.json`);
  console.log(`   - Stars should appear in WikiLinks, backlinks, and dynamic panes`);

  // Keep browser open for manual inspection
  console.log('\n👀 Browser kept open for manual inspection. Press Ctrl+C to close.');
})();
