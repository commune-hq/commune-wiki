import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🧪 Testing Updated Star Modal (v2)...\n');

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
      fontSize: styles.fontSize
    };
  });

  if (headerStar) {
    console.log('✓ Header star found');
    console.log(`  - Text: "${headerStar.text}"`);
    console.log(`  - Cursor: ${headerStar.cursor}`);
    console.log(`  - Font size: ${headerStar.fontSize}`);
  } else {
    console.log('✗ Header star not found');
  }

  // Test clicking the header star
  console.log('\n🖱️  Test 2: Click header star to open modal');
  await page.click('.prose h1 .star-indicator');
  await wait(500);

  const modalContent = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    if (!modal) return { exists: false };

    const styles = window.getComputedStyle(modal);
    const title = modal.querySelector('h2')?.textContent;
    const paragraphs = Array.from(modal.querySelectorAll('.star-modal-body p')).map(p => p.textContent);
    const link = modal.querySelector('.star-link');
    const hasDetail = !!modal.querySelector('.star-modal-detail');

    return {
      exists: true,
      display: styles.display,
      title,
      paragraphs,
      linkExists: !!link,
      linkHref: link?.getAttribute('href'),
      linkText: link?.textContent,
      hasDetailSection: hasDetail
    };
  });

  if (modalContent.exists) {
    console.log('✓ Modal opened successfully');
    console.log(`  - Display: ${modalContent.display}`);
    console.log(`  - Title: "${modalContent.title}"`);
    console.log(`  - Paragraph count: ${modalContent.paragraphs.length}`);
    console.log(`  - Content preview: "${modalContent.paragraphs[0]?.substring(0, 60)}..."`);
    console.log(`  - Has old "Why Stars Matter" section: ${modalContent.hasDetailSection ? '✗ YES (should be removed)' : '✓ NO'}`);
    console.log(`  - Link exists: ${modalContent.linkExists}`);
    if (modalContent.linkExists) {
      console.log(`  - Link text: "${modalContent.linkText}"`);
      console.log(`  - Link href: ${modalContent.linkHref}`);
    }
  } else {
    console.log('✗ Modal not found or not opened');
  }

  // Take screenshot with modal open
  console.log('\n📸 Taking screenshot with modal open...');
  await page.screenshot({ path: 'scripts/star-modal-v2-open.png', fullPage: false });
  console.log('  ✓ Saved: scripts/star-modal-v2-open.png');

  // Test closing modal by clicking outside content (on backdrop area)
  console.log('\n🖱️  Test 3: Close modal by clicking outside content');

  // Get position of backdrop that's not covered by content
  const backdropPos = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    const backdrop = modal.querySelector('.star-modal-backdrop');
    const rect = backdrop.getBoundingClientRect();
    // Click in top-left corner of backdrop (away from content)
    return { x: rect.left + 10, y: rect.top + 10 };
  });

  await page.mouse.click(backdropPos.x, backdropPos.y);
  await wait(300);

  const modalClosedByBackdrop = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    const styles = window.getComputedStyle(modal);
    return styles.display === 'none';
  });

  console.log(modalClosedByBackdrop ? '✓ Modal closed by backdrop click' : '✗ Modal did NOT close by backdrop click');

  // Test mobile viewport
  console.log('\n📱 Test 4: Mobile viewport');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000);

  // Open modal on mobile
  await page.click('.star-indicator');
  await wait(500);

  const mobileModalInfo = await page.evaluate(() => {
    const modal = document.getElementById('star-modal');
    const content = modal?.querySelector('.star-modal-content');
    const body = modal?.querySelector('.star-modal-body');
    if (!content || !body) return null;

    const contentStyles = window.getComputedStyle(content);
    const bodyStyles = window.getComputedStyle(body);
    const icon = modal.querySelector('.star-modal-icon');
    const iconStyles = window.getComputedStyle(icon);

    // Check if modal requires scrolling
    const contentHeight = content.scrollHeight;
    const viewportHeight = window.innerHeight;
    const requiresScroll = contentHeight > viewportHeight * 0.9;

    return {
      isOpen: window.getComputedStyle(modal).display === 'flex',
      width: contentStyles.width,
      maxHeight: contentStyles.maxHeight,
      bodyPadding: bodyStyles.padding,
      iconFontSize: iconStyles.fontSize,
      requiresScroll,
      contentHeight,
      viewportHeight
    };
  });

  if (mobileModalInfo?.isOpen) {
    console.log('✓ Modal works on mobile');
    console.log(`  - Modal width: ${mobileModalInfo.width}`);
    console.log(`  - Body padding: ${mobileModalInfo.bodyPadding}`);
    console.log(`  - Icon size: ${mobileModalInfo.iconFontSize}`);
    console.log(`  - Content height: ${mobileModalInfo.contentHeight}px`);
    console.log(`  - Viewport height: ${mobileModalInfo.viewportHeight}px`);
    console.log(`  - Requires scrolling: ${mobileModalInfo.requiresScroll ? '✗ YES (should be tighter!)' : '✓ NO'}`);

    // Take mobile screenshot
    console.log('\n📸 Taking mobile screenshot...');
    await page.screenshot({ path: 'scripts/star-modal-v2-mobile.png', fullPage: false });
    console.log('  ✓ Saved: scripts/star-modal-v2-mobile.png');
  } else {
    console.log('✗ Modal did not open on mobile');
  }

  await page.keyboard.press('Escape');
  await wait(300);

  // Summary
  console.log('\n✅ Updated Modal Test Summary:');
  console.log(`  - Header star inline: ${headerStar ? '✓' : '✗'}`);
  console.log(`  - Modal opens: ${modalContent.exists ? '✓' : '✗'}`);
  console.log(`  - Old detail section removed: ${!modalContent.hasDetailSection ? '✓' : '✗'}`);
  console.log(`  - Link to star page: ${modalContent.linkExists ? '✓' : '✗'}`);
  console.log(`  - Backdrop click closes: ${modalClosedByBackdrop ? '✓' : '✗'}`);
  console.log(`  - Mobile no scroll: ${mobileModalInfo && !mobileModalInfo.requiresScroll ? '✓' : '✗'}`);

  console.log('\n👀 Browser kept open for manual testing. Press Ctrl+C to close.');
})();
