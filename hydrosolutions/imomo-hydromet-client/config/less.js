'use strict';

module.exports.tasks = {
  watch: {
    // Whenever the LESS source changes, compile it an make it available in
    // the localized directories.
    less: {
      files: [ '<%= yeoman.app %>/styles/*.less' ],
      tasks: [ 'less:dev' ]
    }
  },
  // Compile LESS files into CSS
  less: {
    dev: {
      options: {
        strictImports: true,
        sourceMap: true,
        sourceMapBasepath: '<%= yeoman.app %>/styles/'
      },
      files: [ {
        expand: true,
        cwd: '<%= yeoman.app %>/',
        src: [ 'styles/*.less' ],
        dest: '<%= yeoman.app %>/',
        ext: '.css'
      } ]
    },
    dist: {
      files: {
        '<%= yeoman.tmp %>/styles/main.css': '<%= yeoman.app %>/styles/main.less'
      }
    }
  }
};
