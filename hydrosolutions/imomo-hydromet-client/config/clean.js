'use strict';

module.exports.tasks = {
  // Empties folders to start fresh
  clean: {
    dist: {
      files: [ {
        dot: true,
        src: [
          '<%= yeoman.tmp %>/*',
          '<%= yeoman.dist %>/*'
        ]
      } ]
    },
    server: '.tmp'
  }
}
