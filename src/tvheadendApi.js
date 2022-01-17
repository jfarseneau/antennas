const axios = require('axios');

async function get(apiPath, config) {
  let options = {
    responseType: 'json',
    timeout: 1500,
  };

  if (config.tvheadend_username) {
    options.auth = {
      username: config.tvheadend_username,
      password: config.tvheadend_password,
    }
  }

  return await axios.get(`${config.tvheadend_parsed_uri}${apiPath}`, options);
}

module.exports = { get }
