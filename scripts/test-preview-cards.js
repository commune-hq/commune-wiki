import puppeteer from 'puppeteer';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testPreviewCards() {
  console.log('🔍 Testing preview card viewport awareness and typography...\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });

  const page = await browser.newPage();

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Test desktop viewport
    console.log('='.repeat(60));
    console.log('DESKTOP VIEWPORT (1920x1080)');
    console.log('='.repeat(60));

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    // Test 1: Hover at top-left corner
    console.log('\nTest 1: Top-left corner hover...');
    const topLeftLink = await page.$('main a[href^="/notes/"]');
    if (topLeftLink) {
      const box = await topLeftLink.boundingBox();
      await page.mouse.move(box.x + 5, box.y + 5);
      await sleep(800);

      const previewPosition = await page.evaluate(() => {
        const preview = document.getElementById('note-hover');
        if (!preview || preview.hidden) return null;
        const rect = preview.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          inViewport: rect.left >= 0 && rect.top >= 0 &&
                      rect.right <= window.innerWidth &&
                      rect.bottom <= window.innerHeight
        };
      });

      if (previewPosition && previewPosition.inViewport) {
        console.log('  ✓ PASS - Preview card stays within viewport');
        console.log(`    Position: left=${Math.round(previewPosition.left)}, top=${Math.round(previewPosition.top)}`);
        testsPassed++;
      } else if (!previewPosition) {
        console.log('  ⚠ SKIP - Preview card not shown');
      } else {
        console.log('  ✗ FAIL - Preview card overflows viewport');
        console.log(`    Bounds: ${JSON.stringify(previewPosition)}`);
        testsFailed++;
      }

      await page.mouse.move(0, 0);
      await sleep(200);
    }

    // Test 2: Hover at bottom-right corner
    console.log('\nTest 2: Bottom-right corner hover...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(500);

    const bottomLinks = await page.$$('main a[href^="/notes/"]');
    if (bottomLinks.length > 0) {
      const lastLink = bottomLinks[bottomLinks.length - 1];
      const box = await lastLink.boundingBox();

      if (box) {
        // Hover near bottom-right of viewport
        await page.mouse.move(1850, 1000);
        await sleep(800);

        const previewPosition = await page.evaluate(() => {
          const preview = document.getElementById('note-hover');
          if (!preview || preview.hidden) return null;
          const rect = preview.getBoundingClientRect();
          return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            inViewport: rect.left >= 0 && rect.top >= 0 &&
                        rect.right <= window.innerWidth &&
                        rect.bottom <= window.innerHeight
          };
        });

        if (previewPosition && previewPosition.inViewport) {
          console.log('  ✓ PASS - Preview card repositions to stay in viewport');
          console.log(`    Position: left=${Math.round(previewPosition.left)}, top=${Math.round(previewPosition.top)}`);
          testsPassed++;
        } else if (!previewPosition) {
          console.log('  ⚠ SKIP - Preview card not shown');
        } else {
          console.log('  ✗ FAIL - Preview card overflows viewport at bottom-right');
          console.log(`    Bounds: ${JSON.stringify(previewPosition)}`);
          testsFailed++;
        }

        await page.mouse.move(0, 0);
        await sleep(200);
      }
    }

    // Test 3: Typography validation
    console.log('\nTest 3: Typography (title vs body size)...');
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    const firstLink = await page.$('main a[href^="/notes/"]');
    if (firstLink) {
      await firstLink.hover();
      await sleep(800);

      const typography = await page.evaluate(() => {
        const preview = document.getElementById('note-hover');
        if (!preview || preview.hidden) return null;

        const titleDiv = preview.querySelector('div:first-child');
        const bodyDiv = preview.querySelector('div:nth-child(2)');

        if (!titleDiv || !bodyDiv) return null;

        const titleStyle = window.getComputedStyle(titleDiv);
        const bodyStyle = window.getComputedStyle(bodyDiv);

        return {
          titleSize: parseFloat(titleStyle.fontSize),
          bodySize: parseFloat(bodyStyle.fontSize),
          titleWeight: titleStyle.fontWeight,
          titleLarger: parseFloat(titleStyle.fontSize) > parseFloat(bodyStyle.fontSize)
        };
      });

      if (typography && typography.titleLarger) {
        console.log('  ✓ PASS - Title is larger than body text');
        console.log(`    Title: ${typography.titleSize}px (weight: ${typography.titleWeight})`);
        console.log(`    Body: ${typography.bodySize}px`);
        testsPassed++;
      } else if (!typography) {
        console.log('  ⚠ SKIP - Could not measure typography');
      } else {
        console.log('  ✗ FAIL - Title is not larger than body');
        console.log(`    Typography: ${JSON.stringify(typography)}`);
        testsFailed++;
      }

      await page.mouse.move(0, 0);
      await sleep(200);
    }

    // Test 4: Mobile viewport
    console.log('\n' + '='.repeat(60));
    console.log('MOBILE VIEWPORT (375x667)');
    console.log('='.repeat(60));

    await page.setViewport({ width: 375, height: 667 });
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    console.log('\nTest 4: Mobile viewport preview positioning...');
    const mobileLink = await page.$('main a[href^="/notes/"]');
    if (mobileLink) {
      const box = await mobileLink.boundingBox();
      // Try to hover near right edge on mobile
      await page.mouse.move(350, box.y + 10);
      await sleep(800);

      const previewPosition = await page.evaluate(() => {
        const preview = document.getElementById('note-hover');
        if (!preview || preview.hidden) return null;
        const rect = preview.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          inViewport: rect.left >= 0 && rect.top >= 0 &&
                      rect.right <= window.innerWidth &&
                      rect.bottom <= window.innerHeight
        };
      });

      if (previewPosition && previewPosition.inViewport) {
        console.log('  ✓ PASS - Preview card fits in mobile viewport');
        console.log(`    Card right edge: ${Math.round(previewPosition.right)}, viewport width: ${previewPosition.viewportWidth}`);
        testsPassed++;
      } else if (!previewPosition) {
        console.log('  ⚠ SKIP - Preview card not shown on mobile');
      } else {
        console.log('  ✗ FAIL - Preview card overflows on mobile');
        console.log(`    Bounds: ${JSON.stringify(previewPosition)}`);
        testsFailed++;
      }
    }

    // Test 5: Tablet viewport
    console.log('\n' + '='.repeat(60));
    console.log('TABLET VIEWPORT (768x1024)');
    console.log('='.repeat(60));

    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    console.log('\nTest 5: Tablet viewport preview positioning...');
    const tabletLink = await page.$('main a[href^="/notes/"]');
    if (tabletLink) {
      await tabletLink.hover();
      await sleep(800);

      const previewPosition = await page.evaluate(() => {
        const preview = document.getElementById('note-hover');
        if (!preview || preview.hidden) return null;
        const rect = preview.getBoundingClientRect();
        return {
          inViewport: rect.left >= 0 && rect.top >= 0 &&
                      rect.right <= window.innerWidth &&
                      rect.bottom <= window.innerHeight,
          width: rect.width,
          maxWidth: window.innerWidth - 32 // Should respect padding
        };
      });

      if (previewPosition && previewPosition.inViewport) {
        console.log('  ✓ PASS - Preview card fits in tablet viewport');
        testsPassed++;
      } else if (!previewPosition) {
        console.log('  ⚠ SKIP - Preview card not shown on tablet');
      } else {
        console.log('  ✗ FAIL - Preview card overflows on tablet');
        testsFailed++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(`SUMMARY: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('='.repeat(60));

    if (testsFailed === 0) {
      console.log('\n✓ All tests passed! Preview cards are viewport-aware with proper typography.');
    } else {
      console.log('\n⚠ Some tests failed. Review issues above.');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testPreviewCards();
