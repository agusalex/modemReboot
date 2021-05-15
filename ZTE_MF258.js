/*
 * @name Reboot ZTE MF258A modem. Should work with pretty much any ZTE modem
 * Used by Italian LTE Providers (TIM, PosteMobile, etc...) 
 *
 * @desc Puppeteer script for rebooting a ZTE modem. 
 * since the specific navigation for your modem will vary, this 
 * is more of an example and isn't guaranteed to work for your particular
 * modem. 
 * Created by github.com/shiner66
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
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--headless', '--disable-gpu']
        });
    } else {
        browser = await puppeteer.launch({
            headless: false
        });
    }

    timeMe(1, 'Logging in.');

    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 768
    });
    await delay(1000);

    await page.goto(URL + '/pub/login.htm', {
        waitUntil: 'load',
        timeout: 0
    });;
    await page.type('#username', USER, {
        delay: 10
    });
    await page.type('input[type="password"]', PASS, {
        delay: 10
    });
    /* Need it to correctly pass the login click
    It's ugly, I know. */
    const form = await page.$('#button');
    await form.evaluate(form => form.click());

    /* We need this delay to correctly load the page before navigating, else we'll be redirected to login */
    await delay(5000)

    timeMe(1, 'Going to restart.');
    await page.goto(URL + '/system_wait.asp', {
        waitUntil: 'load',
        timeout: 0
    });

    timeMe(1, 'Waiting 10s');
    await delay(10000);
    timeMe(1, 'Terminating. All Done!');
    await browser.close();
    process.exit(1);
})()