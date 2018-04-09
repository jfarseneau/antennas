const config = require('./config');

function parseTvheadendURI(uri) {
  let splitURI = uri.split('@');
  if (splitURI.length > 1) {
    let password = splitURI[0].split(':')[2];
    let username = splitURI[0].split(":")[1].substr(2);
    let parsedURI = `${splitURI[0].split(":")[0]}://${splitURI[1]}`
    return {
      username: username,
      password: password,
      uri: parsedURI,
    }
  } else {
    return {
      username: null,
      password: null,
      uri: uri,
    }
  }
}

module.exports = function(apiPath, tvheadendUrl) {
  let tvheadend = parseTvheadendURI(`${tvheadendUrl}${apiPath}`)
  const options = {
    url: tvheadend.uri,
    method: 'GET',
    json: true,
    timeout: 1500,
  };

  if (tvheadend.username) {
    options.auth = {
      'user': tvheadend.username,
      'pass': tvheadend.password,
      'sendImmediately': false
    }
  }

  return options;
}
