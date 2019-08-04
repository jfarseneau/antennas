const Router = require('koa-router');

const antennas_config = require('./routes/antennas_config');
const device_xml = require('./routes/device_xml');
const connection_manager = require('./routes/connection_manager');
const content_directory = require('./routes/content_directory');
const discover = require('./routes/discover');
const lineup_status = require('./routes/lineup_status');
const lineup = require('./routes/lineup');
const stream = require('./routes/stream');

module.exports = function() {
  const router = new Router();

  router.get('/antennas_config.json', async (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = await antennas_config();
  });

  router.get('/device.xml', (ctx, next) => {
    ctx.type = "application/xml"
    ctx.body = device_xml();
  });

  router.get('/ConnectionManager.xml', (ctx, next) => {
    ctx.type = "application/xml";
    ctx.body = connection_manager();
  });

  router.get('/ContentDirectory.xml', (ctx, next) => {
    ctx.type = "application/xml";
    ctx.body = content_directory();
  });

  router.get('/discover.json', (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = discover();
  });

  router.get('/lineup_status.json', (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = lineup_status();
  });

  router.get('/lineup.json', async (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = await lineup();
  });

  router.get('/stream', async (ctx, next) => {
    ctx.type = "application/x-mpegURL"
    ctx.body = stream();
  });

  // Still don't know if this is useful or not
  router.post('/lineup.post', (ctx, next) => {
    ctx.type = "application/json"
  });

  return router;
};
