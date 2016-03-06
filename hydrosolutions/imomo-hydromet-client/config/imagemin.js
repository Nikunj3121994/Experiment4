'use strict';

module.exports.tasks = {
  // Minifies the images, except SVG.
  imagemin: {
    dist: {
      files: [ {
        expand: true,
        cwd: '<%= yeoman.app %>/images',
        src: '*.{png,jpg,jpeg,gif}',
        dest: '<%= yeoman.tmp %>/images'
      } ]
    }
  }
};
