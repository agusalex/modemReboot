    /*
 * @name Reboot Arris modem. 
 *
 * @desc Puppeteer script for rebooting an Arris modem. 
 * since the specific navigation for your modem will vary, this 
 * is more of an example and isn't guaranteed to work for your particular
 * modem. 
 * Many thanks to https://stackoverflow.com/users/6870228/keith for his help!
 *
 */

const puppeteer = require('puppeteer');
const date = require('date-and-time');

const USER = process.env.USER || "admin";
const PASS = process.env.PASS || "admin";
const URL = process.env.URL;

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

	timeMe(1, 'Login...');
	/*const browser = await puppeteer.launch({
		headless: false
	});*/
	const browser =await puppeteer.launch({
	executablePath: '/usr/bin/chromium-browser',
	args: ['--no-sandbox', '--headless', '--disable-gpu']
	});
	
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
    await delay(1000);

	timeMe(1, 'Go to reboots...');
    
    await page.goto(URL+'/#/administration/reset', {
		waitUntil: 'load',
		timeout: 0
    });
    await delay(4000);
  
    page.click( "#reset_content_container > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button" )
   
    timeMe(1, 'Waiting for dialog');
    await page.on("dialog", (dialog) => {
        timeMe(1, 'Dialog is up');
        delay(1000);
		dialog.accept();
		timeMe(1, "Accepted...");
        delay(1000);
    });
    timeMe(1, 'Pause...');
	await delay(10000);
	timeMe(1, 'Exiting...');
	await browser.close();
	process.exit(1);
})()