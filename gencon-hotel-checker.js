const puppeteer = require('puppeteer');
const fs = require('fs');

async function checkHotels(sessionCookie, queueCookie, email) {
  // Create write stream for logging
  const logStream = fs.createWriteStream('debug.log', {flags: 'w'});
  const log = (msg) => {
    console.log(msg);
    logStream.write(msg + '\n');
  };

  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Monitor all redirects
    page.on('response', response => {
      log('Response URL: ' + response.url());
      if (response.request().isNavigationRequest()) {
        log('Navigation to: ' + response.url());
      }
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    // Set all required cookies
    await page.setCookie(
      {
        name: 'JSESSIONID',
        value: sessionCookie,
        domain: 'book.passkey.com',
        path: '/',
        secure: true,
        httpOnly: true
      },
      {
        name: 'QueueITAccepted-SDFrts345E-V3_gencon2025',
        value: queueCookie,
        domain: 'book.passkey.com',
        path: '/'
      },
      {
        name: 'AWSALB',
        value: 'eG6L0au7SWigvHh/rGvecQrKljn3hoTjNZyGM8rPEznLeUz7XuERzb3V10k0lmtUBezj1RPMxXC9OwvLwzqMy8VN8oG7FqAg1LQoONmr32HA1aa4pwW1duPr8LyH',
        domain: 'book.passkey.com',
        path: '/'
      },
      {
        name: 'AWSALBCORS',
        value: 'eG6L0au7SWigvHh/rGvecQrKljn3hoTjNZyGM8rPEznLeUz7XuERzb3V10k0lmtUBezj1RPMxXC9OwvLwzqMy8VN8oG7FqAg1LQoONmr32HA1aa4pwW1duPr8LyH',
        domain: 'book.passkey.com',
        path: '/',
        sameSite: 'None',
        secure: true
      },
      {
        name: 'AWSALBTG',
        value: '3zcf7tHkyLDFmLES2kZtU7u7ffgIvCTKr1vluI7LwMATJg0cw/kxJazQE4tyuFXIDACm5nN4c2eSXrhYrNTGFGgx/40U4CXNuEBkHgZHZP2XKZdXRkqcHUDxZH6JYEr/ir1V08D4zjQ2aYMtOCvQ/b2roExPqdCUlnquv+Wlo33ZCvoAxTU=',
        domain: 'book.passkey.com',
        path: '/'
      },
      {
        name: 'AWSALBTGCORS',
        value: '3zcf7tHkyLDFmLES2kZtU7u7ffgIvCTKr1vluI7LwMATJg0cw/kxJazQE4tyuFXIDACm5nN4c2eSXrhYrNTGFGgx/40U4CXNuEBkHgZHZP2XKZdXRkqcHUDxZH6JYEr/ir1V08D4zjQ2aYMtOCvQ/b2roExPqdCUlnquv+Wlo33ZCvoAxTU=',
        domain: 'book.passkey.com',
        path: '/',
        sameSite: 'None',
        secure: true
      },
      {
        name: 'XSRF-TOKEN',
        value: 'fb7b932c-ea06-4444-8902-2a823617f36b',
        domain: 'book.passkey.com',
        path: '/',
        secure: true
      },
      {
        name: '_dd_s',
        value: 'rum=0&expire=1740344159693',
        domain: '.passkey.com',
        path: '/',
        sameSite: 'None'
      },
      {
        name: '_ga',
        value: 'GA1.1.1689463260.1740335552',
        domain: '.passkey.com',
        path: '/'
      },
      {
        name: '_ga_S0NH6BH5G6',
        value: 'GS1.1.1740338123.2.1.1740343258.0.0.0',
        domain: '.passkey.com',
        path: '/'
      },
      {
        name: 'cookieConsent_50910675',
        value: 'ALL',
        domain: 'book.passkey.com',
        path: '/'
      }
    );

    // Set headers including nonce from CSP
    await page.setExtraHTTPHeaders({
      'Referer': 'https://book.passkey.com/event/50910675/owner/10909638/home',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
      'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Upgrade-Insecure-Requests': '1',
      'Connection': 'keep-alive',
      'X-XSRF-TOKEN': 'fb7b932c-ea06-4444-8902-2a823617f36b'
    });

    // First load the home page
    log('Loading home page...');
    await page.goto('https://book.passkey.com/event/50910675/owner/10909638/home', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Click "Manage Existing Reservation"
    await page.waitForSelector('a[href="#existing-reservations"]');
    await page.click('a[href="#existing-reservations"]');
    
    // Wait for modal to appear
    await page.waitForSelector('#existing-reservations.modal.fade.existing-reservations.in');

    // Enter acknowledgement number
    await page.waitForSelector('#ackNum');
    await page.type('#ackNum', email); // Using email as ack number for now

    // Click the Next button
    await page.waitForSelector('#existing-res-submit-btn');
    await page.click('#existing-res-submit-btn');

    // Wait for the question form with captcha
    await page.waitForSelector('#existing-reservations-question', {
      visible: true,
      timeout: 5000
    });

    // Fill in email on the verification form
    await page.waitForSelector('#existing-res-question #email');
    await page.type('#existing-res-question #email', email);

    // Wait for and solve reCAPTCHA (will need manual intervention)
    log('Waiting for reCAPTCHA to be solved...');
    await page.waitForFunction(() => {
      return !!document.querySelector('#g-recaptcha-response')?.value;
    }, {timeout: 120000}); // 2 minute timeout for solving captcha

    // Submit the verification form
    await page.waitForSelector('#existing-res-submit-btn-question:not([disabled])');
    await page.click('#existing-res-submit-btn-question');

    // Wait for navigation to hotel list
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    log('Final URL: ' + page.url());
    await page.screenshot({path: 'debug.png', fullPage: true});

    await browser.close();
    logStream.end();

  } catch (error) {
    log('Error: ' + error.toString());
    logStream.end();
  }
}

// Get arguments from command line
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Please provide session cookie, queue cookie, and email');
  console.log('Usage: node gencon-hotel-checker.js <session-cookie> <queue-cookie> <email>');
  process.exit(1);
}

const [sessionCookie, queueCookie, email] = args;
checkHotels(sessionCookie, queueCookie, email); 