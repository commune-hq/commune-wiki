/**
 * Puppeteer test to verify card title formatting matches
 */

const puppeteer = require('puppeteer');

async function testCardFormatting(url, siteName) {
  console.log(`\n🔍 Testing ${siteName} (${url})...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for backlinks to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await page.evaluate(() => {
      const updatesTitle = document.querySelector('.updates-card .card-title');
      const backlinksTitle = document.querySelector('.backlinks-card h4');

      const updatesStyles = window.getComputedStyle(updatesTitle);
      const backlinksStyles = window.getComputedStyle(backlinksTitle);

      return {
        updates: {
          fontSize: updatesStyles.fontSize,
          fontWeight: updatesStyles.fontWeight,
          margin: updatesStyles.margin,
          color: updatesStyles.color
        },
        backlinks: {
          fontSize: backlinksStyles.fontSize,
          fontWeight: backlinksStyles.fontWeight,
          margin: backlinksStyles.margin,
          color: backlinksStyles.color
        }
      };
    });

    console.log('Updates Card Title:');
    console.log(`  Font Size: ${result.updates.fontSize}`);
    console.log(`  Font Weight: ${result.updates.fontWeight}`);
    console.log(`  Margin: ${result.updates.margin}`);
    console.log(`  Color: ${result.updates.color}`);

    console.log('\nBacklinks Card Title:');
    console.log(`  Font Size: ${result.backlinks.fontSize}`);
    console.log(`  Font Weight: ${result.backlinks.fontWeight}`);
    console.log(`  Margin: ${result.backlinks.margin}`);
    console.log(`  Color: ${result.backlinks.color}`);

    // Check if they match
    const matches = {
      fontSize: result.updates.fontSize === result.backlinks.fontSize,
      fontWeight: result.updates.fontWeight === result.backlinks.fontWeight,
      margin: result.updates.margin === result.backlinks.margin,
      color: result.updates.color === result.backlinks.color
    };

    console.log('\n✓ Formatting Check:');
    console.log(`  Font Size: ${matches.fontSize ? '✅' : '❌'}`);
    console.log(`  Font Weight: ${matches.fontWeight ? '✅' : '❌'}`);
    console.log(`  Margin: ${matches.margin ? '✅' : '❌'}`);
    console.log(`  Color: ${matches.color ? '✅' : '❌'}`);

    const allMatch = Object.values(matches).every(v => v);

    await browser.close();

    if (!allMatch) {
      throw new Error(`${siteName}: Card title formatting does not match`);
    }

    console.log(`\n✨ ${siteName} passed! Card titles match perfectly.`);
    return true;

  } catch (error) {
    await browser.close();
    console.error(`\n❌ ${siteName} failed:`, error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Testing card title formatting on localhost and production...\n');

  try {
    await testCardFormatting('http://localhost:4321/', 'Localhost');
    await testCardFormatting('https://devonmeadows.com/', 'Production');

    console.log('\n🎉 All formatting tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Test suite failed');
    process.exit(1);
  }
}

runTests();
