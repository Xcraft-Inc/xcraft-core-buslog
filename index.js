'use strict';

var moduleName = 'buslog';

var util = require ('util');

var busClient = require ('xcraft-core-busclient').global;
var xLog      = require ('xcraft-core-log') (moduleName);

var prefix = 'GreatHall: ';


var log = function (mode, args) {
  xLog[mode].apply (this, args);

  var text = util.format.apply (this, Array.prototype.slice.call (args));
  busClient.events.send ('widget.text.' + mode, {
    prefix: prefix,
    text:   text
  });
};

exports.info = function () {
  log ('info', arguments);
};

exports.warn = function () {
  log ('warn', arguments);
};

exports.err = function () {
  log ('err', arguments);
};

exports.progress = function (topic, position, length) {
  busClient.events.send ('widget.progress', {
    prefix:   prefix,
    topic:    topic,
    position: position,
    length:   length
  });
};
