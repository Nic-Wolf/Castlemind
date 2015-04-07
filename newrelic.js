/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['castlemind'],
  /**
   * Your New Relic license key.
   */
  license_key : '2a4fcf8febb5b3d46dec9954f17367b482bee29e',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info',

    filepath: require('path').resolve(__dirname, './newrelic_agent.log')
  }
};

