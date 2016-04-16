'use strict';

var prefix = 'GreatHall';


function BusLog (xLog, response) {
  var self = this;

  self._response = response;
  self._xLog = xLog;

  self._xLog.getLevels ().forEach (function (level) {
    self._xLog.on (level, function (msg) {
      self.log (level, msg);
    });
  });
}

BusLog.prototype.log = function (mode, msg) {
  if (!this._response || !this._response.isConnected ()) {
    return;
  }

  this._response.events.send ('widget.text.' + mode, {
    prefix: prefix,
    mod:    msg.module,
    text:   msg.message
  });
};

BusLog.prototype.progress = function (topic, position, length) {
  if (!this._response || !this._response.isConnected ()) {
    return;
  }

  this._response.events.send ('widget.progress', {
    prefix:   prefix,
    mod:      this._xLog.getModule (),
    topic:    topic,
    position: position,
    length:   length
  });
};

module.exports = function (xLog, busClient) {
  return new BusLog (xLog, busClient);
};
