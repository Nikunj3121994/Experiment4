'use strict';

module.exports.tasks = {
  // Reads HTML for usemin blocks to enable smart builds that automatically
  // concat, minify and revision files. Creates configurations in memory so
  // additional tasks can operate on them
  useminPrepare: {
    en: {
      src: [ '<%= yeoman.tmp %>/en/index.html' ],
      options: {
        dest: '<%= yeoman.tmp %>/en/',
        staging: '<%= yeoman.tmp %>/en/',
        flow: {
          html: {
            steps: {
              js: [ 'concat', 'uglifyjs' ],
              css: [ 'cssmin' ]
            },
            post: {}
          }
        }
      }
    },
    ru: {
      src: [ '<%= yeoman.tmp %>/ru/index.html' ],
      options: {
        dest: '<%= yeoman.tmp %>/ru/',
        staging: '<%= yeoman.tmp %>/ru/',
        flow: {
          html: {
            steps: {
              js: [ 'concat', 'uglifyjs' ],
              css: [ 'cssmin' ]
            },
            post: {}
          }
        }
      }
    }
  },
  // Performs rewrites based on filerev and useminPrepare configurations.
  usemin: {
    'en-html': {
      files: [ {
        src: '<%= yeoman.tmp %>/en/**/*.html'
      } ],
      options: {
        assetsDirs: [ '<%= yeoman.tmp %>/en/', '<%= yeoman.tmp %>' ],
        type: 'html'
      }
    },
    'en-css': {
      files: [ {
        src: '<%= yeoman.tmp %>/en/styles/*.css'
      } ],
      options: {
        assetsDirs: [ '<%= yeoman.tmp %>/en/', '<%= yeoman.tmp %>' ],
        type: 'css'
      }
    },
    'ru-html': {
      files: [ {
        src: '<%= yeoman.tmp %>/ru/**/*.html'
      } ],
      options: {
        assetsDirs: [ '<%= yeoman.tmp %>/ru/', '<%= yeoman.tmp %>' ],
        type: 'html'
      }
    },
    'ru-css': {
      files: [ {
        src: '<%= yeoman.tmp %>/ru/styles/*.css'
      } ],
      options: {
        assetsDirs: [ '<%= yeoman.tmp %>/ru/', '<%= yeoman.tmp %>' ],
        type: 'css'
      }
    }
  }
};
