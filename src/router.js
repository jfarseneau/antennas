const Router = require('koa-router');

const getAntennasConfig = require('./routes/getAntennasConfig');
const getDeviceXML = require('./routes/getDeviceXML');
const getConnectionManagerXML = require('./routes/getConnectionManagerXML');
const getContentDirectoryXML = require('./routes/getContentDirectoryXML');
const getLineupStatus = require('./routes/getLineupStatus');
const getLineup = require('./routes/getLineup');

module.exports = (config, device) => {
  const router = new Router();

  router.get('/antennas_config.json', async (ctx) => {
    ctx.type = 'application/json';
    ctx.body = await getAntennasConfig(config);
  });

  router.get('/api/antennas_config.json', async (ctx) => {
    ctx.type = 'application/json';
    ctx.body = await getAntennasConfig(config);
  });

  router.get('/device.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = getDeviceXML(device);
  });

  router.get('/ConnectionManager.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = getConnectionManagerXML();
  });

  router.get('/ContentDirectory.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = getContentDirectoryXML();
  });

  router.get('/discover.json', (ctx) => {
    ctx.type = 'application/json';
    ctx.body = device;
  });

  router.get('/lineup_status.json', (ctx) => {
    ctx.type = 'application/json';
    ctx.body = getLineupStatus();
  });

  router.get('/lineup.json', async (ctx) => {
    ctx.type = 'application/json';
    ctx.body = await getLineup(config);
  });

  // Still don't know if this is useful or not
  router.post('/lineup.post', (ctx) => {
    ctx.type = 'application/json';
  });

  return router;
};
