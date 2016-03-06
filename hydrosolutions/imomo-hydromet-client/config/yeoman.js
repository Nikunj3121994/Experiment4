'use strict';

module.exports.tasks = {
  // Project settings
  yeoman: {
    // configurable paths
    app: require( '../bower.json' ).appPath || 'app',
    dist: 'dist',
    tmp: '.tmp',
    test: 'test'
  }
};
