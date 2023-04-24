const axios = require('axios');
const AxiosDigest = require('axios-digest').default;

async function get(apiPath, config) {
  const options = {
    responseType: 'json',
    timeout: 1500,
  };

  if (config.tvheadendUsername) {
    options.auth = {
      username: config.tvheadendUsername,
      password: config.tvheadendPassword,
    };
  }

  try {
    return await axios.get(`${config.tvheadendUrl}${apiPath}`, options);
  } catch (err) {
    if (err && err.response && err.response.status === 401) {
      const axiosDigest = new AxiosDigest(config.tvheadendUsername, config.tvheadendPassword);
      return axiosDigest.get(`${config.tvheadendUrl}${apiPath}`);
    }

    return err;
  }
}

module.exports = { get };
