const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();

  // Test on mobile viewport (iPhone 13 Pro)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true
  });

  console.log('📱 Testing star nowrap on mobile viewport (390x844)...\n');

  // Test a starred note (Gamification drives self-discovery is starred)
  const testUrl = 'https://devonmeadows.com/notes/gamification-drives-self-discovery/';

  console.log(`Navigating to: ${testUrl}`);
  await page.goto(testUrl, { waitUntil: 'networkidle0' });

  // Wait for star to be added by script
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check h1 title with star
  const titleInfo = await page.evaluate(() => {
    const h1 = document.querySelector('.prose h1');
    if (!h1) return { error: 'No h1 found' };

    const star = h1.querySelector('.star-indicator');
    if (!star) return { error: 'No star found' };

    // Get the wrapper span (should have white-space: nowrap)
    const wrapper = star.parentElement;
    const wrapperStyle = window.getComputedStyle(wrapper);

    // Get bounding boxes
    const h1Rect = h1.getBoundingClientRect();
    const starRect = star.getBoundingClientRect();

    return {
      h1Text: h1.textContent,
      h1Width: h1Rect.width,
      h1Height: h1Rect.height,
      starTop: starRect.top,
      starLeft: starRect.left,
      starBottom: starRect.bottom,
      wrapperWhiteSpace: wrapperStyle.whiteSpace,
      wrapperText: wrapper.textContent,
      // Check if star is on same line as title text
      starOnSameLine: Math.abs(h1Rect.top - starRect.top) < 10
    };
  });

  console.log('\n📊 Title + Star Analysis:');
  console.log(`H1 Text: "${titleInfo.h1Text}"`);
  console.log(`H1 Width: ${titleInfo.h1Width}px`);
  console.log(`H1 Height: ${titleInfo.h1Height}px`);
  console.log(`Wrapper white-space: ${titleInfo.wrapperWhiteSpace}`);
  console.log(`Wrapper text: "${titleInfo.wrapperText}"`);
  console.log(`Star position: top=${titleInfo.starTop}px, left=${titleInfo.starLeft}px`);
  console.log(`Star on same line as title: ${titleInfo.starOnSameLine}`);

  if (!titleInfo.starOnSameLine) {
    console.log('\n❌ ISSUE: Star appears to be on a different line from title!');
  } else {
    console.log('\n✅ Star is on same line as title');
  }

  // Take screenshot
  await page.screenshot({
    path: 'scripts/star-nowrap-mobile.png',
    fullPage: false
  });
  console.log('\n📸 Screenshot saved to scripts/star-nowrap-mobile.png');

  console.log('\nKeeping browser open for inspection...');
  console.log('Press Ctrl+C to close.');
})();
