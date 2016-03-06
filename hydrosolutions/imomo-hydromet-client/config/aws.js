'use strict';

module.exports = function ( grunt ) {
  return {
    tasks: {
      // The keys are loaded from a separate JSON file not available in
      // version control.
      aws: grunt.file.readJSON( 'aws-keys.json' ),
      // The task to upload the dist to AWS S3.
      aws_s3: { // jshint ignore:line
        options: {
          accessKeyId: '<%= aws.AWSAccessKeyId %>',
          secretAccessKey: '<%= aws.AWSSecretKey %>',
          region: 'eu-central-1',
          uploadConcurrency: 8,
          downloadConcurrency: 8
        },
        clean: {
          options: {
            bucket: 'hydromet.imomohub.kg'
          },
          files: [ {
            action: 'delete',
            dest: '/'
          } ]
        },
        dist: {
          options: {
            bucket: 'hydromet.imomohub.kg'
          },
          files: [ {
            expand: true,
            cwd: 'dist/',
            src: [ '**/*.html', '**/*.yaml' ],
            dest: '/',
            action: 'upload',
            params: {
              CacheControl: 'no-cache'
            }
          }, {
            expand: true,
            cwd: 'dist/',
            src: [ '**', '!**/*.html', '!**/*.yaml' ],
            dest: '/',
            action: 'upload',
            params: {
              CacheControl: 'max-age=315360000'
            }
          } ]
        }
      }
    }
  };
};
