'use strict';

var prefix = 'GreatHall';

function BusLog(xLog, resp) {
  var self = this;

  self._resp = resp;
  self._xLog = xLog;

  self._xLog.getLevels().forEach(function (level) {
    self._xLog.on(level, function (msg) {
      self.log(level, msg);
    });
  });
}

BusLog.prototype.log = function (mode, msg) {
  if (!this._resp || !this._resp.isConnected()) {
    return;
  }

  if (
    (msg.overwatch || mode === 'err') &&
    this._resp.hasCommand &&
    this._resp.hasCommand('overwatch.exception')
  ) {
    this._resp.command.send('overwatch.exception', {
      error: {
        ...(msg.overwatch || {err: msg.message}),
        mod: msg.module,
        time: msg.time,
      },
    });
  }

  this._resp.events.send('widget.text.' + mode, {
    prefix: prefix,
    mod: msg.module,
    text: msg.message,
  });
};

BusLog.prototype.progress = function (topic, position, length) {
  if (!this._resp || !this._resp.isConnected()) {
    return;
  }

  this._resp.events.send('widget.progress', {
    prefix: prefix,
    mod: this._xLog.getModule(),
    topic: topic,
    position: position,
    length: length,
  });
};

module.exports = function (xLog, resp) {
  return new BusLog(xLog, resp);
};
