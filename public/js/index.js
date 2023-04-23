function fetch(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function replace(elementId) {
  return function(content) {
    document.querySelector(elementId).innerHTML = content;
  }
}

function urlReplace(elementId) {
  return function(content) {
    document.querySelector(elementId).href = content;
    document.querySelector(elementId).innerHTML = content;
  }
}

fetch('/antennas_config.json').then((result) => {
  let config = JSON.parse(result);
  replace('#status')(config.status);
  urlReplace('#tvheadendUrl')(config.tvheadendUrl);
  urlReplace('#tvheadendStreamUrl')(config.tvheadendStreamUrl);
  urlReplace('#antennasUrl')(config.antennasUrl);
  replace('#tunerCount')(config.tunerCount);
  replace('#channelCount')(config.channelCount);
  replace('#deviceName')(config.deviceName);
  replace('#deviceManufacturer')(config.deviceManufacturer);
  urlReplace('#deviceManufacturerUrl')(config.deviceManufacturerUrl);
  replace('#deviceModelNumber')(config.deviceModelNumber);
  replace('#deviceFirmwareName')(config.deviceFirmwareName);
  replace('#deviceFirmwareVersion')(config.deviceFirmwareVersion);
  replace('#deviceAuth')(config.deviceAuth);
});

