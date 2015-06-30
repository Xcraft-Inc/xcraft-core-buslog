'use strict';

var prefix = 'GreatHall';


function BusLog (xLog) {
  var self = this;

  self._xLog = xLog;

  self._xLog.getLevels ().forEach (function (level) {
    self._xLog.on (level, function (msg) {
      self.log (level, msg);
    });
  });
}

BusLog.prototype.log = function (mode, msg) {
  var busClient = require ('xcraft-core-busclient').global;
  if (!busClient.isConnected ()) {
    return;
  }

  busClient.events.send ('widget.text.' + mode, {
    prefix: prefix,
    mod:    msg.moduleName,
    text:   msg.message
  });
};

BusLog.prototype.progress = function (topic, position, length) {
  var busClient = require ('xcraft-core-busclient').global;
  if (!busClient.isConnected ()) {
    return;
  }

  busClient.events.send ('widget.progress', {
    prefix:   prefix,
    mod:      this._xLog.getModuleName (),
    topic:    topic,
    position: position,
    length:   length
  });
};

module.exports = function (xLog) {
  return new BusLog (xLog);
};
