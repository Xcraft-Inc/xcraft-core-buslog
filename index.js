'use strict';

var moduleName = 'buslog';

var util = require ('util');

var busClient = require ('xcraft-core-busclient');
var xLog      = require ('xcraft-core-log') (moduleName);


var log = function (mode, args) {
  xLog[mode].apply (this, args);

  var text = util.format.apply (this, Array.prototype.slice.call (args));
  busClient.events.send ('widget.text.' + mode, text);
};

exports.info = function () {
  log ('info', arguments);
};

exports.warn = function () {
  log ('info', arguments);
};

exports.err = function () {
  log ('info', arguments);
};