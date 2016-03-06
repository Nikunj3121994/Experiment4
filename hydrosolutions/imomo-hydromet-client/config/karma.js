'use strict';

module.exports.tasks = {
  // Test settings
  karma: {
    // The unit target is used in conjunction with the watch task.
    unit: {
      configFile: 'karma.conf.js',
      background: true
    },
    // The single target is for a one-time full run of the test suite.
    // Used in the CI server.
    single: {
      configFile: 'karma.conf.js',
      singleRun: true,
      background: false,
      autoWatch: false
    }
  }
};
