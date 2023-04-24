module.exports = function getDeviceXML(device) {
  return `<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:dlna="urn:schemas-dlna-org:device-1-0" xmlns:pnpx="http://schemas.microsoft.com/windows/pnpx/2005/11" xmlns:df="http://schemas.microsoft.com/windows/2008/09/devicefoundation">
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
}