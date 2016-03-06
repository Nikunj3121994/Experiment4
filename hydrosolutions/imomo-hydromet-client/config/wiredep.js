'use strict';

module.exports.tasks = {
  watch: {
    // When the bower.json changes, make sure that the index file has all
    // the correct libraries.
    wiredep: {
      files: [ 'bower.json' ],
      tasks: [ 'wiredep' ]
    }
  },
  // Automatically inject Bower components into the app
  wiredep: {
    install: {
      src: [ '<%= yeoman.app %>/index.jade' ],
      ignorePath: '<%= yeoman.app %>/',
      fileTypes: {
        jade: {
          replace: {
            js: 'script(src=\'/{{filePath}}\')',
            css: 'link(rel=\'stylesheet\', href=\'/{{filePath}}\')'
          }
        }
      }
    }
  }
};
