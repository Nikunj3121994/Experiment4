'use strict';

module.exports.tasks = {
  // Minify SVG images when possible
  svgmin: {
    dist: {
      files: [ {
        expand: true,
        cwd: '<%= yeoman.app %>/images',
        src: '*.svg',
        dest: '<%= yeoman.tmp %>/images'
      } ]
    }
  }
};
