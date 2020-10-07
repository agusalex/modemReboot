# ModemReboot

[![Docker Hub package][dockerhub-badge]][dockerhub-link]

[dockerhub-badge]: https://img.shields.io/badge/images%20on-Docker%20Hub-blue.svg
[dockerhub-link]: https://hub.docker.com/repository/docker/agusalex/modem_reboot "Docker Hub Image"
Reboot Fibertel Technicolor CGA4233TCH3 modem

Default User and Password is **custadmin:cga4233**


# Environmental Variables
| Variable |Description  |
|--|--|
|**URL**  | Modem URL |
|**USER**  | Modem USER |
|**PASS**  | Modem Password |
# Setup

To debug with your particular modem first install nodeJs then install dependencies:

```npm install puppeteer date-and-time is-docker  ```

And run it:
```node app.js```

# Running
Run this container  with these **ENV** options : 

```docker run -it -e URL=URL -e USER=USER PASS=PASS agusalex/modemReboot ```
# Tips
Open the developer tools in the browser, inspect element click it and get the ID then you can use it.

For example login-button is the id of the button:

``` const form = await page.$('#login-button');```
   ``` await form.evaluate( form => form.click() ); ```
   
If the element does not have an ID, after inspecting it right click on the DOM of the element and select **Copy Selector**

Then you can use it like so:

``` cpage.click( "OUTPUT FROM COPY SELECTOR" )```

More info in https://pptr.dev/
