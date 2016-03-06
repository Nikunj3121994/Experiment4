'use strict';

module.exports.tasks = {
  // When the source or test JS code changes, run the jshint style check
  // and the test suite.
  // Use newer on jshint to make the check faster.
  watch: {
    js: {
      files: [ '<%= yeoman.app %>/scripts/**/*.js' ],
      tasks: [ 'newer:jshint:src', 'karma:unit:run' ]
    },
    jsTest: {
      files: [ 'test/mock/**/*.js', 'test/spec/**/*.js' ],
      tasks: [ 'newer:jshint:test', 'karma:unit:run' ]
    },
    // The watch task automatically restarts when the Gruntfile.js is being
    // watched and it changes. Also reload on changes to the configuration files.
    gruntfile: {
      files: [ 'Gruntfile.js', 'config/*.js' ],
      options: {
        reload: true
      }
    }
  }
};
