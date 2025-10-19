/**
 * Puppeteer diagnostic script for homepage cards
 * Inspects formatting, spacing, and layout differences
 */

const puppeteer = require('puppeteer');

async function diagnoseCards() {
  console.log('🔍 Diagnosing homepage cards formatting...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto('https://devonmeadows.com/', { waitUntil: 'networkidle2' });

    // Wait for backlinks to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get comprehensive card data
    const cardData = await page.evaluate(() => {
      const updatesCard = document.querySelector('.updates-card');
      const backlinksCard = document.querySelector('.backlinks-card');

      const getCardStyles = (card, cardName) => {
        const styles = window.getComputedStyle(card);
        const title = card.querySelector('h2, h3, h4');
        const titleStyles = title ? window.getComputedStyle(title) : null;

        return {
          name: cardName,
          // Card styles
          padding: styles.padding,
          background: styles.background,
          border: styles.border,
          borderRadius: styles.borderRadius,
          // Title info
          titleTag: title?.tagName,
          titleText: title?.textContent?.trim(),
          titleFontSize: titleStyles?.fontSize,
          titleFontWeight: titleStyles?.fontWeight,
          titleMargin: titleStyles?.margin,
          titleColor: titleStyles?.color,
          // Content
          firstLinkText: card.querySelector('a')?.textContent?.trim(),
          linkCount: card.querySelectorAll('a').length
        };
      };

      return {
        updates: getCardStyles(updatesCard, 'Updates'),
        backlinks: getCardStyles(backlinksCard, 'Backlinks')
      };
    });

    console.log('📊 Card Comparison:\n');
    console.log('Updates Card:');
    console.log(`  Title: <${cardData.updates.titleTag}> "${cardData.updates.titleText}"`);
    console.log(`  Font Size: ${cardData.updates.titleFontSize}`);
    console.log(`  Font Weight: ${cardData.updates.titleFontWeight}`);
    console.log(`  Margin: ${cardData.updates.titleMargin}`);
    console.log(`  Color: ${cardData.updates.titleColor}`);
    console.log(`  Links: ${cardData.updates.linkCount}`);
    console.log();

    console.log('Backlinks Card:');
    console.log(`  Title: <${cardData.backlinks.titleTag}> "${cardData.backlinks.titleText}"`);
    console.log(`  Font Size: ${cardData.backlinks.titleFontSize}`);
    console.log(`  Font Weight: ${cardData.backlinks.titleFontWeight}`);
    console.log(`  Margin: ${cardData.backlinks.titleMargin}`);
    console.log(`  Color: ${cardData.backlinks.titleColor}`);
    console.log(`  Links: ${cardData.backlinks.linkCount}`);
    console.log();

    // Identify differences
    console.log('⚠️  Differences:');
    if (cardData.updates.titleTag !== cardData.backlinks.titleTag) {
      console.log(`  ❌ Title tags: ${cardData.updates.titleTag} vs ${cardData.backlinks.titleTag}`);
    }
    if (cardData.updates.titleFontSize !== cardData.backlinks.titleFontSize) {
      console.log(`  ❌ Font size: ${cardData.updates.titleFontSize} vs ${cardData.backlinks.titleFontSize}`);
    }
    if (cardData.updates.titleFontWeight !== cardData.backlinks.titleFontWeight) {
      console.log(`  ❌ Font weight: ${cardData.updates.titleFontWeight} vs ${cardData.backlinks.titleFontWeight}`);
    }
    if (cardData.updates.titleMargin !== cardData.backlinks.titleMargin) {
      console.log(`  ❌ Title margin: ${cardData.updates.titleMargin} vs ${cardData.backlinks.titleMargin}`);
    }

    await browser.close();

  } catch (error) {
    await browser.close();
    console.error('Error:', error);
    throw error;
  }
}

diagnoseCards();
