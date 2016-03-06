'use strict';

module.exports.tasks = {
  // Copies files to places other tasks can use
  copy: {
    icons: {
      files: [ {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.tmp %>',
        src: [
          'favicon.ico',
          'robots.txt'
        ]
      } ]
    },
    octicons: {
      expand: true,
      cwd: '<%= yeoman.app %>/bower_components/octicons/octicons',
      dest: '<%= yeoman.tmp %>/styles',
      src: [ 'octicons.woff', 'octicons.ttf', 'octicons.eot', 'octicons.svg' ]
    },
    glyphicons: {
      expand: true,
      cwd: '<%= yeoman.app %>/bower_components/bootstrap/fonts/',
      dest: '<%= yeoman.tmp %>/fonts',
      src: 'glyphicons-halflings-regular.*'
    },
    locales: {
      expand: true,
      cwd: '<%= yeoman.app %>/locales',
      dest: '<%= yeoman.tmp %>/locales',
      src: '*.yaml'
    },
    aux: {
      expand: true,
      cwd: '<%= yeoman.app %>',
      dest: '<%= yeoman.tmp %>',
      src: [ 'data/template.xls', 'data/template.xlsx' ]
    },
    dist: {
      files: [ {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.tmp %>',
        dest: '<%= yeoman.dist %>',
        src: [
          '*/views/**/*.html',
          '*/templates/**/*.html',
          '*/*.html'
        ]
      }, {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.tmp %>',
        dest: '<%= yeoman.dist %>/en/',
        src: [
          'images/*.*.{png,jpg,jpeg,gif,svg}',
          'styles/octicons.*',
          'fonts/*',
          'locales/en.yaml',
          'data/template.xls',
          'data/template.xlsx',
          'favicon.ico',
          'robots.txt'
        ]
      }, {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.tmp %>',
        dest: '<%= yeoman.dist %>/ru/',
        src: [
          'images/*.*.{png,jpg,jpeg,gif,svg}',
          'styles/octicons.*',
          'fonts/*',
          'locales/ru.yaml',
          'data/template.xls',
          'data/template.xlsx',
          'favicon.ico',
          'robots.txt'
        ]
      }, {
        expand: true,
        cwd: '<%= yeoman.tmp %>/en/',
        dest: '<%= yeoman.dist %>/en/',
        src: [
          'styles/{vendor,main}.*.css',
          'scripts/{vendor,scripts}.*.js',
        ]
      }, {
        expand: true,
        cwd: '<%= yeoman.tmp %>/ru/',
        dest: '<%= yeoman.dist %>/ru/',
        src: [
          'styles/{vendor,main}.*.css',
          'scripts/{vendor,scripts}.*.js',
        ]
      } ]
    }
  }
};
