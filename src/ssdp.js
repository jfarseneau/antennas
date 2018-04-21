const SSDP = require('node-ssdp').Server
, server = new SSDP({
  location: {
    port: 5004,
    path: '/device.xml'
  },
  allowWildcards: true,
  ssdpSig: 'Antennas/3.0 UPnP/1.0'
})

module.exports = function() {
  console.log("🕵️‍  Broadcasting to SSDP for discovery...");
  server.addUSN('upnp:rootdevice')
  server.addUSN('urn:schemas-upnp-org:device:MediaServer:1')
  server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1')
  server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1')
  server.start()
}
