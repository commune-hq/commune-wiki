/**
 * Quick test for hover preview on research info box wikilinks
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:4321';

async function testHoverPreview() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log('1. Loading research page...');
    await page.goto(`${BASE_URL}/research/oss-business-models`, { waitUntil: 'networkidle0' });

    console.log('2. Waiting for wikilinks to be processed...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('3. Hovering over info box wikilink...');
    const wikilink = await page.$('.research-intro a.wikilink');
    if (!wikilink) {
      throw new Error('No wikilink found in info box');
    }

    // Hover over the link
    await wikilink.hover();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if preview card appeared
    const previewVisible = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[style*="position: fixed"]');
      for (const card of cards) {
        if (card.style.display !== 'none' && card.textContent.length > 0) {
          return true;
        }
      }
      return false;
    });

    if (previewVisible) {
      console.log('   ✅ Preview card appeared on hover');
    } else {
      throw new Error('Preview card did not appear');
    }

    // Move mouse away
    await page.mouse.move(100, 100);
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('   ✅ Test passed!');

    await browser.close();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await browser.close();
    process.exit(1);
  }
}

testHoverPreview();
