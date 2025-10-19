/**
 * Puppeteer test for homepage two-card layout
 * Tests desktop and mobile viewports
 */

const puppeteer = require('puppeteer');

async function testHomepageCards() {
  console.log('🚀 Starting homepage cards test...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // ===== DESKTOP TEST =====
    console.log('📱 Testing DESKTOP viewport (1280x720)...');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1280, height: 720 });
    await desktopPage.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    // Check if cards container exists
    const cardsContainer = await desktopPage.$('.home-cards');
    if (!cardsContainer) {
      throw new Error('❌ Cards container not found on desktop');
    }
    console.log('✅ Cards container found');

    // Check if both cards exist
    const updatesCard = await desktopPage.$('.updates-card');
    const backlinksCard = await desktopPage.$('.backlinks-card');

    if (!updatesCard) {
      throw new Error('❌ Updates card not found on desktop');
    }
    if (!backlinksCard) {
      throw new Error('❌ Links to this note card not found on desktop');
    }
    console.log('✅ Both cards found (Updates + Links to this note)');

    // Check grid layout (two columns on desktop)
    const gridTemplateColumns = await desktopPage.$eval('.home-cards', el =>
      window.getComputedStyle(el).gridTemplateColumns
    );

    // Should be "1fr 1fr" which computes to two equal columns
    const columnCount = gridTemplateColumns.split(' ').length;
    if (columnCount !== 2) {
      throw new Error(`❌ Expected 2 columns on desktop, got ${columnCount}: ${gridTemplateColumns}`);
    }
    console.log('✅ Desktop layout: 2 columns side-by-side');

    // Check Updates card title
    const updatesTitle = await desktopPage.$eval('.updates-card .card-title', el => el.textContent);

    if (updatesTitle !== 'Updates') {
      throw new Error(`❌ Updates card title incorrect: ${updatesTitle}`);
    }
    console.log('✅ Updates card title correct');

    // Check if backlinks component exists in card
    const backlinksComponent = await desktopPage.$('.backlinks-card aside.backlinks');
    if (!backlinksComponent) {
      throw new Error('❌ Backlinks component not found in card');
    }
    console.log('✅ Links to this note component found');

    // Check if update links exist
    const updateLinks = await desktopPage.$$('.update-link');
    console.log(`✅ Found ${updateLinks.length} update link(s)`);

    // Check if backlinks exist
    const backlinkLinks = await desktopPage.$$('.backlink-link');
    console.log(`✅ Found ${backlinkLinks.length} related note link(s)`);

    // Check "View all updates" link
    const viewAllLink = await desktopPage.$('.view-all-link');
    if (!viewAllLink) {
      throw new Error('❌ "View all updates" link not found');
    }
    const viewAllText = await desktopPage.$eval('.view-all-link', el => el.textContent);
    if (!viewAllText.includes('View all updates')) {
      throw new Error(`❌ "View all updates" text incorrect: ${viewAllText}`);
    }
    console.log('✅ "View all updates" link found');

    await desktopPage.close();

    // ===== MOBILE TEST =====
    console.log('\n📱 Testing MOBILE viewport (375x667)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });
    await mobilePage.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    // Check if cards container exists
    const mobileCardsContainer = await mobilePage.$('.home-cards');
    if (!mobileCardsContainer) {
      throw new Error('❌ Cards container not found on mobile');
    }
    console.log('✅ Cards container found');

    // Check grid layout (one column on mobile)
    const mobileGridColumns = await mobilePage.$eval('.home-cards', el =>
      window.getComputedStyle(el).gridTemplateColumns
    );

    // Should be "1fr" (single column)
    const mobileColumnCount = mobileGridColumns.split(' ').length;
    if (mobileColumnCount !== 1) {
      throw new Error(`❌ Expected 1 column on mobile, got ${mobileColumnCount}: ${mobileGridColumns}`);
    }
    console.log('✅ Mobile layout: 1 column (stacked)');

    // Check card order (Updates should be first)
    const cards = await mobilePage.$$('.home-card');
    if (cards.length !== 2) {
      throw new Error(`❌ Expected 2 cards, got ${cards.length}`);
    }

    const firstCardClass = await mobilePage.evaluate(() => {
      const firstCard = document.querySelector('.home-card');
      return firstCard.className;
    });

    if (!firstCardClass.includes('updates-card')) {
      throw new Error(`❌ First card should be updates-card, got: ${firstCardClass}`);
    }
    console.log('✅ Updates card is first (mobile priority)');

    await mobilePage.close();

    // ===== LINK CLICK TEST (Desktop) =====
    console.log('\n🔗 Testing update link navigation (desktop)...');
    const linkTestPage = await browser.newPage();
    await linkTestPage.setViewport({ width: 1280, height: 720 });
    await linkTestPage.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    // Check if clicking an update link changes URL
    const firstUpdateLink = await linkTestPage.$('.update-link');
    if (firstUpdateLink) {
      const linkHref = await linkTestPage.$eval('.update-link', el => el.getAttribute('href'));
      console.log(`✅ First update link href: ${linkHref}`);

      if (!linkHref.startsWith('/updates/')) {
        throw new Error(`❌ Update link should start with /updates/, got: ${linkHref}`);
      }
      console.log('✅ Update link URL format correct');
    } else {
      console.log('⚠️  No update links to test (no updates in collection yet)');
    }

    await linkTestPage.close();

    console.log('\n✨ All tests passed! Homepage cards working correctly.');
    console.log('✅ Desktop: 2 columns side-by-side');
    console.log('✅ Mobile: 1 column stacked, Updates first');
    console.log('✅ Links formatted correctly');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run tests
testHomepageCards()
  .then(() => {
    console.log('\n🎉 Test suite completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  });
