import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🧪 Testing Header Star Hover Tooltip...\n');

  // Navigate to a starred note
  console.log('📍 Navigating to "Ask the Brain" (starred note)');
  await page.goto('https://devonmeadows.com/notes/ask-the-brain/', { waitUntil: 'networkidle0' });
  await wait(2000); // Wait for HeaderStarScript to run

  // Check if star exists
  const starInfo = await page.evaluate(() => {
    const h1 = document.querySelector('.prose h1');
    if (!h1) return { exists: false, error: 'h1 not found' };

    const star = h1.querySelector('.star-indicator');
    if (!star) return { exists: false, error: '.star-indicator not found in h1' };

    const styles = window.getComputedStyle(star);
    return {
      exists: true,
      text: star.textContent,
      title: star.getAttribute('title'),
      cursorStyle: styles.cursor,
      fontSize: styles.fontSize,
      opacity: styles.opacity,
      transform: styles.transform,
      position: star.getBoundingClientRect()
    };
  });

  if (!starInfo.exists) {
    console.log(`❌ Star not found: ${starInfo.error}`);
    await browser.close();
    return;
  }

  console.log('✓ Star found in header');
  console.log(`  - Text: "${starInfo.text}"`);
  console.log(`  - Tooltip (title attr): "${starInfo.title}"`);
  console.log(`  - Cursor style: ${starInfo.cursorStyle}`);
  console.log(`  - Font size: ${starInfo.fontSize}`);
  console.log(`  - Initial opacity: ${starInfo.opacity}`);
  console.log(`  - Initial transform: ${starInfo.transform}`);

  // Check CSS for hover styles
  console.log('\n🎨 Checking CSS hover setup...');

  const cssCheck = await page.evaluate(() => {
    // Check if the styles are in the document
    const styleSheets = Array.from(document.styleSheets);
    let foundHoverRule = false;

    try {
      for (const sheet of styleSheets) {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes('.star-indicator:hover')) {
            foundHoverRule = true;
            return {
              found: true,
              rule: rule.cssText
            };
          }
        }
      }
    } catch (e) {
      // CORS might prevent access to some stylesheets
    }

    return { found: foundHoverRule };
  });

  if (cssCheck.found) {
    console.log('✓ CSS hover rule found:');
    if (cssCheck.rule) {
      console.log(`  ${cssCheck.rule}`);
    }
  } else {
    console.log('⚠️  Could not verify CSS hover rule (might be in cross-origin stylesheet)');
  }

  // Take a screenshot
  console.log('\n📸 Taking screenshot...');
  await page.screenshot({ path: 'scripts/star-hover-ready.png', fullPage: false });
  console.log('  ✓ Screenshot saved: scripts/star-hover-ready.png');

  // Note about browser tooltip
  console.log('\n💡 Browser Tooltip:');
  console.log('  The native browser tooltip (from the "title" attribute) appears after ~1 second');
  console.log('  of hovering. This is controlled by the browser and should show:');
  console.log(`  "${starInfo.title}"`);

  console.log('\n👀 Browser kept open - hover over the star in the h1 title to see the tooltip!');
  console.log('Press Ctrl+C when done.');
})();
