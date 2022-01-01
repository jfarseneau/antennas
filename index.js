#!/usr/bin/env node

const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const fs = require('fs');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// Version only comes in when run with NPM, so make this optional
let antennasVersion = process.env.npm_package_version ? `v${process.env.npm_package_version}` : ''; 
if (argv.nologo) {
  console.log(`Antennas ${antennasVersion}`);
} else {
  const logo = fs.readFileSync('./assets/logo.txt','utf8');
  console.log('\x1b[34m%s\x1b[0m', logo, antennasVersion);
}
console.log(``)

// Load config
const configHandler = require('./src/configHandler');
const config = argv.config ? configHandler.loadConfig(argv.config) : configHandler.loadConfig();

// Setup Antenna components
const device = require('./src/device')(config);
const router = require('./src/router')(config, device);
const ssdp = require('./src/ssdp');

// TODO: Figure out the discovery protocol UDP thing on port 65001
// Mainly, WHAT IS THAT YOU WANT PLEX?!

const app = new Koa();

try {
  app
    .use(logger())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('public', { extensions: true }))
    .use(async function pageNotFound(ctx) {
      ctx.status = 404;
      ctx.type = 'html';
      ctx.body = fs.createReadStream('public/404.html');
    });

  app.listen(5004);
  
  console.log(`📡 Antennas are deployed! Proxying from ${config.antennas_url}`);
  ssdp.broadcastSSDP(device);
} catch (e) {
  console.log('❌ Antennas failed to deploy! 😮 It could be missing a config file, or something is misconfigured. See below for details:');
  console.log(e);
}


