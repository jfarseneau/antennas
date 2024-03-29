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
  urlReplace('#tvheadendUrl')(config.tvheadend_parsed_uri);
  urlReplace('#tvheadendStreamUrl')(config.tvheadend_parsed_stream_uri);
  urlReplace('#antennasUrl')(config.antennas_url);
  replace('#tunerCount')(config.tuner_count);
  replace('#channelCount')(config.channel_count);
  replace('#status')(config.status);
});

