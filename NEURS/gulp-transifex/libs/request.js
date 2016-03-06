// Generated by CoffeeScript 1.7.1
var https, paths, util;

https = require('https');

paths = require('./paths.js');

util = require('util');

module.exports = function(method, path, options, cb) {
  var request_options, _paths;

  options = util._extend({}, options || {});
  _paths = paths(options);
  request_options = {
    host: _paths.host,
    port: '443',
    path: path,
    auth: options.user + ':' + options.password
  };
  if (options.headers) {
    request_options.headers = options.headers;
  }
  if (method.toUpperCase() === 'GET') {
    return https.get(request_options, cb);
  } else {
    request_options.method = method;
    return https.request(request_options);
  }
};
