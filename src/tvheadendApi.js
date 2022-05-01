const axios = require('axios');
const AxiosDigest = require('axios-digest').default;

async function get(apiPath, config) {
  const options = {
    responseType: 'json',
    timeout: 1500,
  };

  if (config.tvheadend_username) {
    options.auth = {
      username: config.tvheadend_username,
      password: config.tvheadend_password,
    };
  }

  try {
    return await axios.get(`${config.tvheadend_parsed_uri}${apiPath}`, options);
  } catch (err) {
    if (err && err.response && err.response.status === 401) {
      const axiosDigest = new AxiosDigest(config.tvheadend_username, config.tvheadend_password);
      return axiosDigest.get(`${config.tvheadend_parsed_uri}${apiPath}`);
    }

    return err;
  }
}

module.exports = { get };
