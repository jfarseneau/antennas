const Router = require('koa-router');

const lineup = require('./lineup');
const tvheadendApi = require('./tvheadendApi');

async function getConnectionStatus(config) {
  try {
    await tvheadendApi.get('/api/channel/grid?start=0&limit=999999', config);
    return 'All systems go';
  } catch (err) {
    console.log(`
    Antennas failed to connect to Tvheadend!
    Check that:
      - Tvheadend is running.
      - Antennas is correctly pointing to Tvheadend, on the right port.
      - That your username and login are correct.

    Here's a dump of the error:
    ${err}`);

    if (err.response.status === 401) { return 'Failed to authenticate with Tvheadend'; }
    if (err.code === 'ECONNABORTED') { return 'Unable to find Tvheadend server, make sure the server is up and the configuration is pointing to the right spot'; }
    return 'Unknown error, check the logs for more details';
  }
}

module.exports = (config, device) => {
  const router = new Router();

  router.get('/antennas_config.json', async (ctx) => {
    ctx.type = 'application/json';
    config.status = await getConnectionStatus(config);
    ctx.body = config;
  });

  router.get('/device.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = `<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:dlna="urn:schemas-dlna-org:device-1-0" xmlns:pnpx="http://schemas.microsoft.com/windows/pnpx/2005/11" xmlns:df="http://schemas.microsoft.com/windows/2008/09/devicefoundation">
  <specVersion>
      <major>1</major>
      <minor>0</minor>
  </specVersion>
  <URLBase>${device.BaseURL}</URLBase>
  <device>
    <dlna:X_DLNADOC>DMS-1.50</dlna:X_DLNADOC>
    <pnpx:X_hardwareId>VEN_0115&amp;DEV_1040&amp;SUBSYS_0001&amp;REV_0004 VEN_0115&amp;DEV_1040&amp;SUBSYS_0001 VEN_0115&amp;DEV_1040</pnpx:X_hardwareId>
    <pnpx:X_deviceCategory>MediaDevices</pnpx:X_deviceCategory>
    <df:X_deviceCategory>Multimedia</df:X_deviceCategory>
    <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>
    <friendlyName>${device.FriendlyName}</friendlyName>
    <presentationURL>/</presentationURL>
    <manufacturer>${device.Manufacturer}</manufacturer>
    <manufacturerURL>${device.ManufacturerURL}</manufacturerURL>
    <modelDescription>${device.FriendlyName}</modelDescription>
    <modelName>${device.FriendlyName}</modelName>
    <modelNumber>${device.ModelNumber}</modelNumber>
    <modelURL>${device.ManufacturerURL}</modelURL>
    <serialNumber></serialNumber>
    <UDN>uuid:${device.DeviceID}</UDN>
  </device>
  <serviceList>
    <service>
      <serviceType>urn:schemas-upnp-org:service:ConnectionManager:1</serviceType>
      <serviceId>urn:upnp-org:serviceId:ConnectionManager</serviceId>
      <SCPDURL>/ConnectionManager.xml</SCPDURL>
      <controlURL>${device.BaseURL}/ConnectionManager.xml</controlURL>
      <eventSubURL>${device.BaseURL}/ConnectionManager.xml</eventSubURL>
    </service>
    <service>
      <serviceType>urn:schemas-upnp-org:service:ContentDirectory:1</serviceType>
      <serviceId>urn:upnp-org:serviceId:ContentDirectory</serviceId>
      <SCPDURL>/ContentDirectory.xml</SCPDURL>
      <controlURL>${device.BaseURL}/ContentDirectory.xml</controlURL>
      <eventSubURL>${device.BaseURL}/ContentDirectory.xml</eventSubURL>
    </service>
  </serviceList>
  <iconList>
    <icon>
      <mimetype>image/png</mimetype>
      <width>48</width>
      <height>48</height>
      <depth>24</depth>
      <url>/images/apple-touch-icon-57x57.png</url>
    </icon>
    <icon>
      <mimetype>image/png</mimetype>
      <width>120</width>
      <height>120</height>
      <depth>24</depth>
      <url>/images/apple-touch-icon-120x120.png</url>
    </icon>
  </iconList>
</root>`;
  });

  router.get('/ConnectionManager.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = `
    <?xml version="1.0" encoding="utf-8" ?>
    <scpd xmlns="urn:schemas-upnp-org:service-1-0">
      <specVersion>
        <major>1</major>
        <minor>0</minor>
      </specVersion>
      <actionList>
        <action>
          <name>GetProtocolInfo</name>
          <argumentList>
            <argument>
              <name>Source</name>
              <direction>out</direction>
              <relatedStateVariable>SourceProtocolInfo</relatedStateVariable>
            </argument>
            <argument>
              <name>Sink</name>
              <direction>out</direction>
              <relatedStateVariable>SinkProtocolInfo</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
        <action>
          <name>GetCurrentConnectionIDs</name>
          <argumentList>
            <argument>
              <name>ConnectionIDs</name>
              <direction>out</direction>
              <relatedStateVariable>CurrentConnectionIDs</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
        <action>
          <name>GetCurrentConnectionInfo</name>
          <argumentList>
            <argument>
              <name>ConnectionID</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>
            </argument>
            <argument>
              <name>RcsID</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_RcsID</relatedStateVariable>
            </argument>
            <argument>
              <name>AVTransportID</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_AVTransportID</relatedStateVariable>
            </argument>
            <argument>
              <name>ProtocolInfo</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_ProtocolInfo</relatedStateVariable>
            </argument>
            <argument>
              <name>PeerConnectionManager</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_ConnectionManager</relatedStateVariable>
            </argument>
            <argument>
              <name>PeerConnectionID</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>
            </argument>
            <argument>
              <name>Direction</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_Direction</relatedStateVariable>
            </argument>
            <argument>
              <name>Status</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_ConnectionStatus</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
      </actionList>
      <serviceStateTable>
        <stateVariable sendEvents="yes">
          <name>SourceProtocolInfo</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="yes">
          <name>SinkProtocolInfo</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="yes">
          <name>CurrentConnectionIDs</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_ConnectionStatus</name>
          <dataType>string</dataType>
          <allowedValueList>
            <allowedValue>OK</allowedValue>
            <allowedValue>ContentFormatMismatch</allowedValue>
            <allowedValue>InsufficientBandwidth</allowedValue>
            <allowedValue>UnreliableChannel</allowedValue>
            <allowedValue>Unknown</allowedValue>
          </allowedValueList>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_ConnectionManager</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_Direction</name>
          <dataType>string</dataType>
          <allowedValueList>
            <allowedValue>Input</allowedValue>
            <allowedValue>Output</allowedValue>
          </allowedValueList>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_ProtocolInfo</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_ConnectionID</name>
          <dataType>i4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_AVTransportID</name>
          <dataType>i4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_RcsID</name>
          <dataType>i4</dataType>
        </stateVariable>
      </serviceStateTable>
    </scpd>`;
  });

  router.get('/ContentDirectory.xml', (ctx) => {
    ctx.type = 'application/xml';
    ctx.body = `
    <?xml version="1.0" encoding="utf-8"?>
    <scpd xmlns="urn:schemas-upnp-org:service-1-0">
      <specVersion>
        <major>1</major>
        <minor>0</minor>
      </specVersion>
      <actionList>
        <action>
          <name>Browse</name>
          <argumentList>
            <argument>
              <name>ObjectID</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_ObjectID</relatedStateVariable>
            </argument>
            <argument>
              <name>BrowseFlag</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_BrowseFlag</relatedStateVariable>
            </argument>
            <argument>
              <name>Filter</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_Filter</relatedStateVariable>
            </argument>
            <argument>
              <name>StartingIndex</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_Index</relatedStateVariable>
            </argument>
            <argument>
              <name>RequestedCount</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
              <name>SortCriteria</name>
              <direction>in</direction>
              <relatedStateVariable>A_ARG_TYPE_SortCriteria</relatedStateVariable>
            </argument>
            <argument>
              <name>Result</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_Result</relatedStateVariable>
            </argument>
            <argument>
              <name>NumberReturned</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
              <name>TotalMatches</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
              <name>UpdateID</name>
              <direction>out</direction>
              <relatedStateVariable>A_ARG_TYPE_UpdateID</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
        <action>
          <name>GetSearchCapabilities</name>
          <argumentList>
            <argument>
              <name>SearchCaps</name>
              <direction>out</direction>
              <relatedStateVariable>SearchCapabilities</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
        <action>
          <name>GetSortCapabilities</name>
          <argumentList>
            <argument>
              <name>SortCaps</name>
              <direction>out</direction>
              <relatedStateVariable>SortCapabilities</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
        <action>
          <name>GetSystemUpdateID</name>
          <argumentList>
            <argument>
              <name>Id</name>
              <direction>out</direction>
              <relatedStateVariable>SystemUpdateID</relatedStateVariable>
            </argument>
          </argumentList>
        </action>
      </actionList>
      <serviceStateTable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_SortCriteria</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_UpdateID</name>
          <dataType>ui4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_Filter</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_Result</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_Index</name>
          <dataType>ui4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_ObjectID</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>SortCapabilities</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>SearchCapabilities</name>
          <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_Count</name>
          <dataType>ui4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
          <name>A_ARG_TYPE_BrowseFlag</name>
          <dataType>string</dataType>
          <allowedValueList>
            <allowedValue>BrowseMetadata</allowedValue>
            <allowedValue>BrowseDirectChildren</allowedValue>
          </allowedValueList>
        </stateVariable>
        <stateVariable sendEvents="yes">
          <name>SystemUpdateID</name>
          <dataType>ui4</dataType>
        </stateVariable>
      </serviceStateTable>
    </scpd>`;
  });

  router.get('/discover.json', (ctx) => {
    ctx.type = 'application/json';
    ctx.body = device;
  });

  router.get('/lineup_status.json', (ctx) => {
    ctx.type = 'application/json';
    ctx.body = {
      ScanInProgress: 0,
      ScanPossible: 1,
      Source: 'Cable',
      SourceList: ['Cable'],
    };
  });

  router.get('/lineup.json', async (ctx) => {
    ctx.type = 'application/json';
    ctx.body = await lineup(config);
  });

  // Still don't know if this is useful or not
  router.post('/lineup.post', (ctx) => {
    ctx.type = 'application/json';
  });

  return router;
};
