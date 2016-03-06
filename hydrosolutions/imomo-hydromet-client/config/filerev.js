'use strict';

module.exports.tasks = {
  // Renames files for browser caching purposes
  filerev: {
    dist: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      files: [ {
        expand: true,
        cwd: '<%= yeoman.tmp %>/en/',
        src: [
          'scripts/{vendor,scripts}.js',
          'styles/{vendor,main}.css',
        ],
        dest: '<%= yeoman.tmp %>/en/'
      }, {
        expand: true,
        cwd: '<%= yeoman.tmp %>/ru/',
        src: [
          'scripts/{vendor,scripts}.js',
          'styles/{vendor,main}.css',
        ],
        dest: '<%= yeoman.tmp %>/ru/'
      }, {
        expand: true,
        cwd: '<%= yeoman.tmp %>/',
        src: [
          'images/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        dest: '<%= yeoman.tmp %>/'
      } ]
    }
  }
};
