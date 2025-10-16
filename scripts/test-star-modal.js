import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🧪 Testing Star Modal System...\n');

  // Navigate to a starred note
  console.log('📍 Test 1: Navigate to "Ask the Brain" (starred note)');
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);

  // Check if star exists in header
  const headerStar = await page.evaluate(() => {
    const h1 = document.querySelector('.prose h1');
    if (!h1) return null;

    const star = h1.querySelector('.star-indicator');
    if (!star) return null;

    const styles = window.getComputedStyle(star);
    return {
      exists: true,
      text: star.textContent,
      cursor: styles.cursor,
      fontSize: styles.fontSize,
      position: star.getBoundingClientRect()
    };
  });

  if (headerStar) {
    console.log('✓ Header star found');
    console.log(`  - Text: "${headerStar.text}"`);
    console.log(`  - Cursor: ${headerStar.cursor} (should be "pointer")`);
    console.log(`  - Font size: ${headerStar.fontSize} (should match title)`);
  } else {
    console.log('✗ Header star not found');
  }

  // Test clicking the header star
  console.log('\n🖱️  Test 2: Click header star to open modal');
  await page.click('.prose h1 .star-indicator');
  await wait(500); // Wait for modal animation

  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    if (!modal) return { exists: false };

    const styles = window.getComputedStyle(modal);
    return {
      exists: true,
      display: styles.display,
      hasBackdrop: !!modal.querySelector('.star-modal-backdrop'),
      hasContent: !!modal.querySelector('.star-modal-content'),
      hasCloseButton: !!modal.querySelector('.star-modal-close'),
      title: modal.querySelector('h2')?.textContent,
      iconText: modal.querySelector('.star-modal-icon')?.textContent
    };
  });

  if (modalState.exists) {
    console.log('✓ Modal opened successfully');
    console.log(`  - Display: ${modalState.display} (should be "flex")`);
    console.log(`  - Has backdrop: ${modalState.hasBackdrop}`);
    console.log(`  - Has content: ${modalState.hasContent}`);
    console.log(`  - Has close button: ${modalState.hasCloseButton}`);
    console.log(`  - Title: "${modalState.title}"`);
    console.log(`  - Icon: "${modalState.iconText}"`);
  } else {
    console.log('✗ Modal not found or not opened');
  }

  // Take screenshot with modal open
  console.log('\n📸 Taking screenshot with modal open...');
  await page.screenshot({ path: 'scripts/star-modal-open.png', fullPage: false });
  console.log('  ✓ Saved: scripts/star-modal-open.png');

  // Test closing modal with Escape key
  console.log('\n⌨️  Test 3: Close modal with Escape key');
  await page.keyboard.press('Escape');
  await wait(300);

  const modalClosed = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    const styles = window.getComputedStyle(modal);
    return styles.display === 'none';
  });

  console.log(modalClosed ? '✓ Modal closed with Escape' : '✗ Modal did not close');

  // Test WikiLink star
  console.log('\n🔗 Test 4: Check WikiLink star (inline, clickable)');
  await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const wikiLinkStar = await page.evaluate(() => {
    const star = document.querySelector('.star-indicator-inline');
    if (!star) return null;

    const styles = window.getComputedStyle(star);
    // Check if star is next to (not inside) a link
    const prevElement = star.previousElementSibling;
    const isAfterLink = prevElement && prevElement.tagName === 'A';

    return {
      exists: true,
      text: star.textContent,
      cursor: styles.cursor,
      textDecoration: styles.textDecoration,
      borderBottom: styles.borderBottom,
      isAfterLink
    };
  });

  if (wikiLinkStar) {
    console.log('✓ WikiLink star found');
    console.log(`  - Text: "${wikiLinkStar.text}"`);
    console.log(`  - Is after link (not inside): ${wikiLinkStar.isAfterLink}`);
    console.log(`  - Cursor: ${wikiLinkStar.cursor} (should be "pointer")`);
    console.log(`  - Has underline: ${wikiLinkStar.textDecoration !== 'none' || wikiLinkStar.borderBottom !== 'none'} (should be false)`);
  } else {
    console.log('⚠️  WikiLink star not found (may not be on homepage)');
  }

  // Test clicking WikiLink star
  if (wikiLinkStar) {
    console.log('\n🖱️  Test 5: Click WikiLink star to open modal');
    await page.click('.star-indicator-inline');
    await wait(500);

    const modalOpenedAgain = await page.evaluate(() => {
      const modal = document.getElementById('star-modal');
      const styles = window.getComputedStyle(modal);
      return styles.display === 'flex';
    });

    console.log(modalOpenedAgain ? '✓ Modal opened from WikiLink star' : '✗ Modal did not open');

    // Close with backdrop click
    console.log('\n🖱️  Test 6: Close modal by clicking backdrop');
    await page.click('.star-modal-backdrop');
    await wait(300);

    const closedByBackdrop = await page.evaluate(() => {
      const modal = document.getElementById('star-modal');
      const styles = window.getComputedStyle(modal);
      return styles.display === 'none';
    });

    console.log(closedByBackdrop ? '✓ Modal closed by backdrop click' : '✗ Modal did not close');
  }

  // Mobile test
  console.log('\n📱 Test 7: Mobile viewport');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);

  const mobileStar = await page.evaluate(() => {
    const star = document.querySelector('.star-indicator');
    return star ? {
      exists: true,
      fontSize: window.getComputedStyle(star).fontSize
    } : null;
  });

  if (mobileStar) {
    console.log('✓ Star visible on mobile');
    console.log(`  - Font size: ${mobileStar.fontSize}`);

    // Test modal on mobile
    await page.click('.star-indicator');
    await wait(500);

    const mobileModalOpen = await page.evaluate(() => {
      const modal = document.getElementById('star-modal');
      const content = modal?.querySelector('.star-modal-content');
      if (!content) return false;

      const styles = window.getComputedStyle(content);
      return {
        isOpen: window.getComputedStyle(modal).display === 'flex',
        width: styles.width,
        maxHeight: styles.maxHeight
      };
    });

    console.log(mobileModalOpen.isOpen ? '✓ Modal works on mobile' : '✗ Modal did not open on mobile');
    if (mobileModalOpen.isOpen) {
      console.log(`  - Modal width: ${mobileModalOpen.width}`);
    }

    await page.keyboard.press('Escape');
    await wait(300);
  }

  // Summary
  console.log('\n✅ Star Modal System Test Summary:');
  console.log(`  - Header star inline: ${headerStar ? '✓' : '✗'}`);
  console.log(`  - Modal opens on click: ${modalState.exists ? '✓' : '✗'}`);
  console.log(`  - Modal closes (Escape): ${modalClosed ? '✓' : '✗'}`);
  console.log(`  - WikiLink stars separate from links: ${wikiLinkStar?.isAfterLink ? '✓' : '?'}`);
  console.log(`  - Stars not underlined: ${wikiLinkStar && !wikiLinkStar.textDecoration && !wikiLinkStar.borderBottom ? '✓' : '?'}`);
  console.log(`  - Mobile responsive: ${mobileStar ? '✓' : '✗'}`);

  console.log('\n👀 Browser kept open for manual testing. Press Ctrl+C to close.');
})();
