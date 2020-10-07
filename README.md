# ModemReboot

[![Docker Hub package][dockerhub-badge]][dockerhub-link]

[dockerhub-badge]: https://img.shields.io/badge/images%20on-Docker%20Hub-blue.svg
[dockerhub-link]: https://hub.docker.com/repository/docker/agusalex/modem_reboot "Docker Hub Image"

Puppeteer container for rebooting Modems
 - The specific navigation for your modem will vary, 
 - This is more of an example and isn't guaranteed to work for your particular modem.
 - Many thanks to https://github.com/mbierman 's [post](https://gist.github.com/mbierman/5b3e671fa4e848eec899ff486d0cdc26)
  and https://stackoverflow.com/users/6870228/keith 
 - Feel free to make a PR to add your own modem's script
 
# Modem List:
Set this as your SCRIPT Env var
| Modem | SCRIPT  |
|--|--|
|**Technicolor CGA4233TCH3 modem (Fibertel)**  | example.js |
|**Arris (Modem Undefined)**  | arris.js |
|**Mitrastar 2541GNA (Movistar)**  | Movistar_Mitrastar_2541GNAC.js |
 
By default will run example.js you can change that by setting SCRIPT parameter.

# Environmental Variables
| Variable |Description  |
|--|--|
|**URL**  | Modem URL |
|**USER**  | Modem USER |
|**PASS**  | Modem Password |
|**SCRIPT**  | Modem Model js Script |

# Configuring it for your own modem model

To debug with your particular modem first install nodeJs then install dependencies:

```npm install puppeteer date-and-time is-docker  ```

And run it:
```node app.js```

# Running
Run this container  with these **ENV** options : 

```docker run -it -e URL=URL -e USER=USER -e PASS=PASS -e SCRIPT=example.js agusalex/modemReboot ```
# Tips
Open the developer tools in the browser, inspect element click it and get the ID then you can use it.

For example login-button is the id of the button:

``` const form = await page.$('#login-button');```
   ``` await form.evaluate( form => form.click() ); ```
   
If the element does not have an ID, after inspecting it right click on the DOM of the element and select **Copy Selector**

Then you can use it like so:

``` cpage.click( "OUTPUT FROM COPY SELECTOR" )```

More info in https://pptr.dev/
# Future Work
```
FROM alpine:3.6 
#copy crontabs for root user 
COPY config/cronjobs /etc/crontabs/root 
#start crond with log level 8 in foreground, output to stderr 
CMD ["crond", "-f", "-d", "8"]
```
