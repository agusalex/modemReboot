    /*
 * Reboot Mitrastar HGU GPT-2541GNAC Movistar modem. 
 *
 * Puppeteer container for rebooting an Mitrastar modem. 
 * since the specific navigation for your modem will vary, this 
 * is more of an example and isn't guaranteed to work for your particular
 * modem. 
 */

const puppeteer = require('puppeteer');
const date = require('date-and-time');
const isDocker = require('is-docker');

const PASS = "process.env.PASS" || ""; //Unique for every modem
const URL = process.env.URL || "http://192.168.1.1";
var browser;
const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

async function timeMe(num, txt) {
	let now = new Date();
	let time = date.format(now, 'dddd MM/DD/YYYY HH:mm:ss, ');
	console.log(time, txt);
}

process.on("unhandledRejection", (reason, p) => {
	console.error("Unhandled Rejection at: Promise (new page)", p, "reason:", reason);
	browser.close();
});

(async() => {
	if (isDocker()) {
		console.log('Running inside a Docker container');
		browser =await puppeteer.launch({
			executablePath: '/usr/bin/chromium-browser',
			args: ['--no-sandbox', '--headless', '--disable-gpu']
			});
	}
	else{
		browser = await puppeteer.launch({
			headless: false
		});
	}
	timeMe(1, 'Login...');
	
	const page = await browser.newPage();
	await page.setViewport({
		width: 1366,
		height: 768
	});
	await delay(1000);

	await page.goto(URL, {
		waitUntil: 'load',
		timeout: 0
    });;
    await delay(2000);
	await page.type('input[type="password"]', PASS, {
		delay: 10
    });
    await delay(2000);
    const form = await page.$('#acceptLogin');
    await form.evaluate( form => form.click() );
    await delay(10000);
    await page.goto(URL+'/configsetting.html', {
		waitUntil: 'load',
        timeout: 0
    });
   timeMe(1, 'Go to reboots...');
    await delay(4000);
    await page.evaluate(() => {
        btnReset();
      });
    timeMe(1, 'Rebooting...');
	await delay(10000);
	timeMe(1, 'Exiting...');
	await browser.close();
	process.exit(1);
})()
