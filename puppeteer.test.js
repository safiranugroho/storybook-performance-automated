const assert = require('assert');
const puppeteer = require('puppeteer');

let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
  });

  const browserVersion = await browser.version();
  console.log(`Started ${browserVersion}`);
});

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

after(async () => {
  await browser.close();
});

describe('App', () => {
 it('renders', async () => {
    const response = await page.goto(`http://${process.env.STORYBOOK_HOST}:${process.env.STORYBOOK_PORT}/?path=/story/atlaskit·menu-performance--button-item`);
    assert(response.ok());

    await page.waitForSelector("iframe");

    const elementHandle = await page.$('iframe#storybook-preview-iframe');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('[data-testid="menu-item"]');
    
    await page.select('select#storybook-addon-performance-copy-select', "10");
    await page.select('select#storybook-addon-performance-sample-select', "10");

    await page.click('button#storybook-addon-performance-start-all-button');

    await page.waitForSelector('button#storybook-addon-performance-pin-button:not([disabled])');
    await page.click('button#storybook-addon-performance-pin-button');
	  
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './results'});

    await page.waitForSelector('button#storybook-addon-performance-save-button:not([disabled])');
    await page.click('button#storybook-addon-performance-save-button');

    await page.screenshot({ path: `./screenshots/app.png` });
  });
});
