'use strict';

var prefix = 'GreatHall';


function BusLog (xLog, busClient) {
  var self = this;

  self._busClient = busClient;
  self._xLog = xLog;

  self._xLog.getLevels ().forEach (function (level) {
    self._xLog.on (level, function (msg) {
      self.log (level, msg);
    });
  });
}

BusLog.prototype.log = function (mode, msg) {
  if (!this._busClient || !this._busClient.isConnected ()) {
    return;
  }

  this._busClient.events.send ('widget.text.' + mode, {
    prefix: prefix,
    mod:    msg.moduleName,
    text:   msg.message
  });
};

BusLog.prototype.progress = function (topic, position, length) {
  if (!this._busClient || !this._busClient.isConnected ()) {
    return;
  }

  this._busClient.events.send ('widget.progress', {
    prefix:   prefix,
    mod:      this._xLog.getModuleName (),
    topic:    topic,
    position: position,
    length:   length
  });
};

module.exports = function (xLog, busClient) {
  return new BusLog (xLog, busClient);
};
