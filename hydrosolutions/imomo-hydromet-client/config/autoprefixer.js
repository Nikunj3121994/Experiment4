'use strict';

module.exports.tasks = {
  // Add vendor prefixed styles
  autoprefixer: {
    options: {
      browsers: [ 'last 1 version' ]
    },
    dist: {
      files: [ {
        expand: true,
        cwd: '<%= yeoman.tmp %>/styles',
        src: '*.css',
        dest: '<%= yeoman.tmp %>/styles'
      } ]
    }
  }
};
