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
const isDocker = require('is-docker');

const USER = '***';
const PASS = '***';
const URL = process.env.URL || "http://192.168.0.1";
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

	await page.goto(URL+'/login.asp', {
		waitUntil: 'load',
		timeout: 0
	});;
	await page.type('#id_username', USER, {
		delay: 10
	});
	await page.type('input[type="password"]', PASS, {
		delay: 10
	});
	await page.click('[value="Login"]');

	timeMe(1, 'Go to home...');
	await page.goto(URL+'/home.asp', {
		waitUntil: 'load',
		timeout: 0
	});
	await page.click('#alertExitButton');

	timeMe(1, 'Go to Config...');
	await page.goto(URL+'/RgConfiguration.asp', {
		waitUntil: 'load',
		timeout: 0
	});
	timeMe(1, 'Submit request...');
	page.click('input[type=submit]');

	timeMe(1, 'Wait for Dialog...');
	page.on('dialog', async dialog => {
		await dialog.accept();
		/*    For debugging           */
		/*      await dialog.dismiss(); */
		timeMe(1, 'Dismiss Dialog...');
	});

	timeMe(1, 'Pause...');
	await delay(10000);
	timeMe(1, 'Exiting...');
	await browser.close();
	process.exit(1);
})()
