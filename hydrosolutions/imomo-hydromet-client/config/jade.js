'use strict';

module.exports.tasks = {
  watch: {
    // Compile the jade files whenever one of them changes or
    // when the locale definitions change.
    jade: {
      options: {
        cwd: '<%= yeoman.app %>'
      },
      files: [ '**/*.jade',
        'locales/*.yaml'
      ],
      tasks: [ 'jade:dev' ]
    }
  },
  // Compile jade templates with i18n support
  jade: {
    options: {
      i18n: {
        locales: [ '<%= yeoman.app %>/locales/en.yaml',
          '<%= yeoman.app %>/locales/ru.yaml'
        ],
        namespace: '$i18n'
      }
    },
    // For a dist build, copies the compiled HTML to the tmp directory.
    // It must be pretty printed to allow the ngmin processors to work.
    dist: {
      options: {
        pretty: true,
        doctype: 'html',
        data: {
          dist: true
        }
      },
      files: [ {
        expand: true,
        cwd: '<%= yeoman.app %>/',
        src: [ '**/*.jade' ],
        dest: '<%= yeoman.tmp %>/',
        ext: '.html'
      } ]
    },
    // For development, the compiled HTML is kept in the app directory under
    // the locale directories, e.g. app/en/index.html
    dev: {
      options: {
        pretty: true,
        doctype: 'html',
        data: {
          dist: false
        }
      },
      files: [ {
        expand: true,
        cwd: '<%= yeoman.app %>/',
        src: [ '**/*.jade' ],
        dest: '<%= yeoman.app %>/',
        ext: '.html'
      } ]
    }
  }
};
