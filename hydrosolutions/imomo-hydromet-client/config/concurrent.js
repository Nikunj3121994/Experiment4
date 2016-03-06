'use strict';

module.exports.tasks = {
  // Run some tasks in parallel to speed up the build process
  concurrent: {
    dist: [
      'copy:icons',
      'copy:octicons',
      'copy:glyphicons',
      'copy:locales',
      'copy:aux',
      'imagemin',
      'svgmin',
    ]
  }
};
