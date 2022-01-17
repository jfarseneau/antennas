function setupSSDP(device) {
  const SSDP = require('node-ssdp').Server; const
    server = new SSDP({
      location: {
        port: 5004,
        path: '/device.xml',
      },
      udn: `uuid:${device.DeviceID}`,
      allowWildcards: true,
      ssdpSig: 'Antennas/3.0 UPnP/1.0',
    });

  return server;
}

function broadcastSSDP(device) {
  console.log('🕵️‍  Broadcasting to SSDP for discovery...');
  const server = setupSSDP(device);
  server.addUSN('upnp:rootdevice');
  server.addUSN('urn:schemas-upnp-org:device:MediaServer:1');
  server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1');
  server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1');
  server.start();
}

module.exports = { broadcastSSDP };
