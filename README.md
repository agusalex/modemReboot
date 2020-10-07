# ModemReboot

[![Docker Hub package][dockerhub-badge]][dockerhub-link]

[dockerhub-badge]: https://img.shields.io/badge/images%20on-Docker%20Hub-blue.svg
[dockerhub-link]: https://hub.docker.com/repository/docker/agusalex/modem_reboot "Docker Hub Image"
Reboot Fibertel Technicolor CGA4233TCH3 modem
Default User and Password is custadmin:cga4233


# Environmental Variables
| Variable |Description  |
|--|--|
|**URL**  | Modem URL |
|**USER**  | Modem USER |
|**PASS**  | Modem Password |

# Running
- Run this container  with these **ENV** options : 

```docker run -it -e URL=URL -e USER=USER PASS=PASS agusalex/modemReboot ```
