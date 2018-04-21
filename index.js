const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const fs = require('fs');

const router = require('./src/router');
const config = require('./src/config');
const device = require('./src/device');

const SSDP = require('node-ssdp').Server
, server = new SSDP({
  location: {
    port: 5004,
    path: '/device.xml'
  },
  allowWildcards: true,
  ssdpSig: 'Antennas 3.0'
})

const app = new Koa();

try {
  app
    .use(logger())
    .use(router().routes())
    .use(router().allowedMethods())
    .use(serve('public', { extensions: true }))
    .use(async function pageNotFound(ctx) {
      ctx.status = 404;
      ctx.type = 'html';
      ctx.body = fs.createReadStream('public/404.html');
    });

  server.addUSN('upnp:rootdevice')
  server.addUSN('urn:schemas-upnp-org:device:MediaServer:1')
  server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1')
  server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1')
  server.start()

  app.listen(5004);
  console.log(`📡  Antennas are deployed! Proxying from ${config().antennas_url}`);
} catch (e) {
  console.log('❌  Antennas failed to deploy! 😮  It could be missing a config file, or something is misconfigured. See below for details:');
  console.log(e);
}


