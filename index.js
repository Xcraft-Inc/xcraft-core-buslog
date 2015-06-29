'use strict';

var busClient = require ('xcraft-core-busclient').global;

var prefix = 'GreatHall';


var log = function (mode, msg) {
  busClient.events.send ('widget.text.' + mode, {
    prefix: prefix,
    mod:    msg.moduleName,
    text:   msg.message
  });
};

module.exports = function (xLog) {
  xLog.getLevels ().forEach (function (level) {
    xLog.on (level, function (msg) {
      log (level, msg);
    });
  });

  return {
    progress: function (topic, position, length) {
      busClient.events.send ('widget.progress', {
        prefix:   prefix,
        mod:      xLog.getModuleName (),
        topic:    topic,
        position: position,
        length:   length
      });
    }
  };
};
