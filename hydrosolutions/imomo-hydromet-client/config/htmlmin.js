'use strict';

module.exports.tasks = {
  // Minify the HTML files to reduce bandwidth usage.
  htmlmin: {
    dist: {
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        preventAttributeEscaping: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true,
        removeIgnored: true,
        caseSensitive: true
      },
      files: [ {
        expand: true,
        cwd: '<%= yeoman.tmp %>',
        src: [ '*/*.html', '*/views/**/*.html', '*/templates/**/*.html' ],
        dest: '<%= yeoman.tmp %>'
      } ]
    }
  }
};
