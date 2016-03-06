'use strict';

module.exports = function ( grunt ) {

  // Load all grunt tasks
  require( 'load-grunt-tasks' )( grunt );

  // Load custom tasks
  grunt.loadTasks( 'tasks' );

  // Time how long tasks take. Can help when optimizing build times
  require( 'time-grunt' )( grunt );

  //loads the various task configuration files
  var configs = require( 'load-grunt-configs' )( grunt );

  // Define the configuration for all the tasks
  grunt.initConfig( configs );

  // This is the main task, builds the site in all available languages.
  grunt.registerTask( 'build', [
    'clean:dist',
    'wiredep',
    'jade:dist',
    'less:dist',
    'concurrent:dist',
    'autoprefixer',
    'useminPrepare:en',
    'useminPrepare:ru',
    'concat',
    'cssmin',
    'uglify',
    'filerev',
    'usemin:en-html',
    'usemin:en-css',
    'usemin:ru-html',
    'usemin:ru-css',
    'htmlmin',
    'copy:dist',
  ] );

  // This task publishes the site to the configured AWS S3 bucket
  // for production.
  grunt.registerTask( 'publish', [
    'aws_s3:clean',
    'aws_s3:dist'
  ] );

  // Executes the whole test suite once.
  grunt.registerTask( 'test', [
    'karma:single'
  ] );

  // Continuous task to keep in the background during development, takes care
  // of compiling the sources and checking the generated code.
  grunt.registerTask( 'devel', [
    'karma:unit:start',
    'watch'
  ] );

  // Generate the documentation for the project.
  grunt.registerTask( 'doc', [
    'jsdoc:dist'
  ] );

  // This is the default task, it checks the style and tests the code
  // before building and also produces the documentation.
  grunt.registerTask( 'default', [
    'jshint',
    'test',
    'build',
    'doc'
  ] );

};
