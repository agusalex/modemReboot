    /*
 * Reboot Technicolor modem. 
 *
 * Puppeteer container for rebooting an Technicolor modem. 
 * since the specific navigation for your modem will vary, this 
 * is more of an example and isn't guaranteed to work for your particular
 * modem. 
 * Many thanks to https://gist.github.com/mbierman/5b3e671fa4e848eec899ff486d0cdc26
  and https://stackoverflow.com/users/6870228/keith 
 *
 */

const puppeteer = require('puppeteer');
const date = require('date-and-time');
const isDocker = require('is-docker');


const USER = process.env.USER || "custadmin";
const PASS = process.env.PASS || "cga4233";
const URL = process.env.URL || "URL";
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

	await page.goto(URL+'/#/login', {
		waitUntil: 'load',
		timeout: 0
    });;
    await delay(2000);
	await page.type('input#username', USER, {
		delay: 30
	});
	await page.type('input[type="password"]', PASS, {
		delay: 10
    });
    const form = await page.$('#login-button');
    await form.evaluate( form => form.click() );
    await delay(10000);

    timeMe(1, 'Go to reboots...');
    await page.screenshot({path: 'screenshot_before.png'});
    await page.goto(URL+'/#/administration/reset', {
		waitUntil: 'load',
		timeout: 20000
    });
    await page.screenshot({path: 'screenshot_after.png'});	
    await delay(4000);
    page.click( "#reset_content_container > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > button" )
   
    timeMe(1, 'Waiting for dialog');
    await page.on("dialog", (dialog) => {
        timeMe(1, 'Dialog is up');
        delay(4000);
		dialog.accept();
		timeMe(1, "Accepted...");
        delay(4000);
    });
    timeMe(1, 'Pause...');
	await delay(10000);
	timeMe(1, 'Exiting...');
	await browser.close();
	process.exit(1);
})()
