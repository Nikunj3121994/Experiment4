'use strict';

module.exports.tasks = {
  // Generate HTML documentation with JSDoc3
  jsdoc: {
    dist: {
      src: [ '<%= yeoman.app %>/scripts/**/*.js' ],
      options: {
        destination: 'doc',
        template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
        configure: 'jsdoc.conf.json'
      }
    }
  }
};
