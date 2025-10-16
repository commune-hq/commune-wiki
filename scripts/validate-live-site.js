import puppeteer from 'puppeteer';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function validateLiveSite() {
  console.log('🔍 Validating fixes on live site (https://devonmeadows.com)...\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Test 1: Homepage - check for backlinks section
    console.log('Test 1: Homepage - backlinks visibility...');
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(2000);

    let linksSection = await page.evaluate(() => {
      const sections = document.querySelectorAll('.backlinks');
      if (sections.length === 0) return 'NOT_FOUND';

      // Check if any section is visible (not hidden)
      for (let section of sections) {
        if (!section.classList.contains('hidden')) {
          const heading = section.querySelector('h4');
          const list = section.querySelector('.backlinks-list');
          const hasItems = list && list.children.length > 0;
          return hasItems ? 'VISIBLE_WITH_LINKS' : 'VISIBLE_NO_LINKS';
        }
      }
      return 'ALL_HIDDEN';
    });

    if (linksSection === 'VISIBLE_WITH_LINKS' || linksSection === 'ALL_HIDDEN') {
      console.log(`  ✓ PASS - Backlinks: ${linksSection === 'VISIBLE_WITH_LINKS' ? 'showing with content' : 'hidden (no links)'}`);
      testsPassed++;
    } else {
      console.log(`  ✗ FAIL - Backlinks: ${linksSection}`);
      testsFailed++;
    }

    // Test 2: Homepage - LIVE badge
    console.log('\nTest 2: Homepage - LIVE badge...');
    let badge = await page.evaluate(() => {
      const badges = document.querySelectorAll('.status-badge.status-live');
      return badges.length > 0 ? 'VISIBLE' : 'NOT_FOUND';
    });

    if (badge === 'VISIBLE') {
      console.log('  ✓ PASS - LIVE badge showing');
      testsPassed++;
    } else {
      console.log('  ✗ FAIL - LIVE badge not found');
      testsFailed++;
    }

    // Test 3: Click a link from homepage - new pane backlinks
    console.log('\nTest 3: Clicking link from homepage - new pane backlinks...');
    const firstLink = await page.$('main a[href^="/notes/"]');
    if (firstLink) {
      await firstLink.click();
      await sleep(2000);

      let newPaneBacklinks = await page.evaluate(() => {
        const panes = document.querySelectorAll('.pane');
        if (panes.length < 2) return 'NO_NEW_PANE';

        const lastPane = panes[panes.length - 1];
        const sections = lastPane.querySelectorAll('.backlinks');

        if (sections.length === 0) return 'NOT_FOUND';

        for (let section of sections) {
          if (!section.classList.contains('hidden')) {
            const list = section.querySelector('.backlinks-list');
            const hasItems = list && list.children.length > 0;
            return hasItems ? 'VISIBLE_WITH_LINKS' : 'VISIBLE_NO_LINKS';
          }
        }
        return 'ALL_HIDDEN';
      });

      if (newPaneBacklinks === 'VISIBLE_WITH_LINKS' || newPaneBacklinks === 'ALL_HIDDEN') {
        console.log(`  ✓ PASS - New pane backlinks: ${newPaneBacklinks === 'VISIBLE_WITH_LINKS' ? 'showing' : 'hidden (no links)'}`);
        testsPassed++;
      } else {
        console.log(`  ✗ FAIL - New pane backlinks: ${newPaneBacklinks}`);
        testsFailed++;
      }

      // Test 4: New pane LIVE badge
      console.log('\nTest 4: New pane - LIVE badge...');
      let newPaneBadge = await page.evaluate(() => {
        const panes = document.querySelectorAll('.pane');
        const lastPane = panes[panes.length - 1];
        const badges = lastPane.querySelectorAll('.status-badge.status-live');
        return badges.length > 0 ? 'VISIBLE' : 'NOT_FOUND';
      });

      if (newPaneBadge === 'VISIBLE') {
        console.log('  ✓ PASS - New pane LIVE badge showing');
        testsPassed++;
      } else {
        console.log('  ✗ FAIL - New pane LIVE badge not found');
        testsFailed++;
      }
    } else {
      console.log('  ⚠ SKIP - No links found on homepage');
    }

    // Test 5: Direct navigation to a note
    console.log('\nTest 5: Direct navigation to /notes/ledger-replaces-feeds/...');
    await page.goto('https://devonmeadows.com/notes/ledger-replaces-feeds/', { waitUntil: 'networkidle2' });
    await sleep(2000);

    let directNavBacklinks = await page.evaluate(() => {
      const sections = document.querySelectorAll('.backlinks');
      if (sections.length === 0) return 'NOT_FOUND';

      for (let section of sections) {
        if (!section.classList.contains('hidden')) {
          const list = section.querySelector('.backlinks-list');
          const hasItems = list && list.children.length > 0;
          return hasItems ? 'VISIBLE_WITH_LINKS' : 'VISIBLE_NO_LINKS';
        }
      }
      return 'ALL_HIDDEN';
    });

    if (directNavBacklinks === 'VISIBLE_WITH_LINKS' || directNavBacklinks === 'ALL_HIDDEN') {
      console.log(`  ✓ PASS - Direct nav backlinks: ${directNavBacklinks === 'VISIBLE_WITH_LINKS' ? 'showing' : 'hidden (no links)'}`);
      testsPassed++;
    } else {
      console.log(`  ✗ FAIL - Direct nav backlinks: ${directNavBacklinks}`);
      testsFailed++;
    }

    let directNavBadge = await page.evaluate(() => {
      const badges = document.querySelectorAll('.status-badge.status-live');
      return badges.length > 0 ? 'VISIBLE' : 'NOT_FOUND';
    });

    if (directNavBadge === 'VISIBLE') {
      console.log('  ✓ PASS - Direct nav LIVE badge showing');
      testsPassed++;
    } else {
      console.log('  ✗ FAIL - Direct nav LIVE badge not found');
      testsFailed++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`SUMMARY: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('='.repeat(50));

    if (testsFailed === 0) {
      console.log('\n✓ All tests passed! Fixes validated on live site.');
    } else {
      console.log('\n⚠ Some tests failed. Review issues above.');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

validateLiveSite();
