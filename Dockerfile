FROM zenika/alpine-chrome:77-with-node
USER root
RUN apk add --no-cache tzdata@edge
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install puppeteer@1.20.0 puppeteer-core@1.20.0 date-and-time@0.14.1 is-docker@2.1.1
COPY * /usr/src/app/
RUN chmod 777 /usr/src/app/entrypoint.sh
ENV SCRIPT=example.js
CMD ["sh", "-c", "/usr/src/app/entrypoint.sh"]