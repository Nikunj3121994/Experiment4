/**
 * React-Native  应用接口
 * 1. 实现酒店业务功能
 */
'use strict';

var React = require('react-native');

var {
    AppRegistry
} = React;

var Hotels = require('./pages/hotels/Hotels');
var Photos = require('./pages/photos/PhotoListScreen');

AppRegistry.registerComponent('Photos', () => Photos);
AppRegistry.registerComponent('Hotels', () => Hotels);

