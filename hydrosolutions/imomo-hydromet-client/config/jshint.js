'use strict';

module.exports.tasks = {
  // Make sure code styles are up to par and there are no obvious mistakes.
  jshint: {
    options: {
      jshintrc: '.jshintrc',
      reporter: require( 'jshint-stylish' )
    },
    src: [
      'Gruntfile.js',
      '<%= yeoman.app %>/scripts/**/*.js'
    ],
    test: {
      options: {
        jshintrc: 'test/.jshintrc'
      },
      src: [ '<%= yeoman.test %>/spec/**/*.js',
        '<%= yeoman.test %>/mock/**/*.js'
      ]
    }
  }
};
