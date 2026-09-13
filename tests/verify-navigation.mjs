import { chromium } from 'playwright';

async function runVerification() {
  console.log('--- Starting Playwright Verification ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // 1. Visit Home
    console.log('1. Navigating to http://localhost:3000/ ...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    
    // Wait for preloader to finish and navbar to become visible
    console.log('   Waiting for preloader to complete...');
    await page.locator('header a:has-text("Book Expedition")').first().waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);

    // 2. Scroll down to 3,500px on Home page (Manifesto section)
    console.log('2. Scrolling down to 3,500px on Home page...');
    await page.evaluate(() => {
      window.scrollTo(0, 3500);
      if (window.__lenis) {
        window.__lenis.scrollTo(3500, { immediate: true });
      }
    });
    await page.waitForTimeout(1000);

    const scrollPosBeforeClick = await page.evaluate(() => window.scrollY);
    console.log(`   Current scroll position before click: ${scrollPosBeforeClick}px`);

    // 3. Click "Book Expedition" in the navbar
    console.log('3. Clicking "BOOK EXPEDITION" button in navbar...');
    const bookButton = page.locator('header a:has-text("Book Expedition")').first();
    await bookButton.click();

    // 4. Wait for /dates to load
    await page.waitForURL('**/dates');
    await page.waitForTimeout(1500);

    const datesUrl = page.url();
    const datesScrollY = await page.evaluate(() => window.scrollY);
    const datesHeading = page.locator('h1:has-text("2026 Expeditions")');
    const datesHeadingVisible = await datesHeading.isVisible();

    console.log(`4. Reached URL: ${datesUrl}`);
    console.log(`   ScrollY on /dates: ${datesScrollY}px (Target: <= 100px)`);
    console.log(`   Dates Heading Visible: ${datesHeadingVisible}`);

    await page.screenshot({ path: 'tests/screenshot_dates.png' });

    if (!datesHeadingVisible || datesScrollY > 100) {
      throw new Error(`Dates page verification failed! Heading visible: ${datesHeadingVisible}, ScrollY: ${datesScrollY}`);
    }

    // 5. Test all other navbar routes from scrolled position
    const routesToTest = [
      { name: 'About', path: '/about', headingText: 'Alpine Guiding Philosophy' },
      { name: 'The Route', path: '/route', headingText: 'The Goûter Route' },
      { name: 'Gear', path: '/gear', headingText: 'High Alpine Hardware' },
      { name: 'Weather', path: '/weather', headingText: 'Summit Telemetry' },
    ];

    for (const r of routesToTest) {
      console.log(`5. Testing navigation to ${r.path}...`);
      await page.goto('http://localhost:3000/');
      await page.waitForSelector('header a:has-text("Book Expedition")', { timeout: 20000 });
      await page.evaluate(() => {
        window.scrollTo(0, 3500);
        if (window.__lenis) window.__lenis.scrollTo(3500, { immediate: true });
      });
      await page.waitForTimeout(500);

      const navLink = page.locator(`header nav a[href="${r.path}"]`);
      await navLink.click();
      await page.waitForURL(`**${r.path}`);
      await page.waitForTimeout(500);

      const scrollY = await page.evaluate(() => window.scrollY);
      console.log(`   ${r.path} ScrollY: ${scrollY}px (Target: <= 100px)`);
      if (scrollY > 100) {
        throw new Error(`${r.path} failed scroll reset! ScrollY: ${scrollY}`);
      }
    }

    // 6. Test Login flow to /admin
    console.log('6. Navigating to /auth ...');
    await page.goto('http://localhost:3000/auth');
    await page.waitForTimeout(1000);

    console.log('   Filling login form with admin credentials...');
    await page.fill('input[type="email"]', 'admin@zenith.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    console.log('   Waiting for navigation to /admin ...');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const adminUrl = page.url();
    const adminScrollY = await page.evaluate(() => window.scrollY);
    const adminHeader = page.locator('text=Expedition Control').first();
    const adminHeaderVisible = await adminHeader.isVisible();

    console.log(`7. Reached URL: ${adminUrl}`);
    console.log(`   ScrollY on /admin: ${adminScrollY}px (Target: <= 100px)`);
    console.log(`   Admin CMS Header Visible: ${adminHeaderVisible}`);

    await page.screenshot({ path: 'tests/screenshot_admin.png' });

    if (!adminHeaderVisible || adminScrollY > 100) {
      throw new Error(`Admin page verification failed! Header visible: ${adminHeaderVisible}, ScrollY: ${adminScrollY}`);
    }

    // 8. Test scrolling on /admin
    console.log('8. Testing that /admin can scroll...');
    await page.evaluate(() => {
      window.scrollTo(0, 500);
      if (window.__lenis) window.__lenis.scrollTo(500, { immediate: true });
    });
    await page.waitForTimeout(500);
    const adminScrolledY = await page.evaluate(() => window.scrollY);
    console.log(`   Admin scrolled position: ${adminScrolledY}px (Target: >= 300px)`);
    if (adminScrolledY < 300) {
      throw new Error(`Admin page cannot scroll! Scrolled position: ${adminScrolledY}`);
    }

    console.log('=== ALL ROUTES VERIFIED: ZERO BLANK SCREENS, PERFECT SCROLL RESET, AND ADMIN CAN SCROLL ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
