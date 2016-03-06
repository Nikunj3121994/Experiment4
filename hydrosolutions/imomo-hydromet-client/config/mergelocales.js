'use strict';

module.exports.tasks = {
  // Merge locales, this ensure that the YAML files are synchronized.
  mergelocales: {
    dev: {
      files: [ {
        expand: true,
        src: [ '<%= yeoman.app %>/locales/*.yaml' ]
      } ]
    }
  }
};
