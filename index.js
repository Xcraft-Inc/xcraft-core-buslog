'use strict';

var prefix = 'GreatHall';

var modesEnum = {
  event: 1 << 0,
  overwatch: 1 << 1,
};

var currentModes = modesEnum.event | modesEnum.overwatch;

function BusLog(xLog, resp) {
  var self = this;

  self._resp = resp;
  self._xLog = xLog;
  self._subs = {
    verb: null,
    info: null,
    warn: null,
    err: null,
    dbg: null,
  };

  this._subscribe();
}

BusLog.prototype._subscribe = function () {
  var self = this;

  if (Object.keys(self._subs).some((level) => !!self._subs[level])) {
    return;
  }

  self._xLog.getLevels().forEach(function (level) {
    self._subs[level] = function (msg) {
      self.log(level, msg);
    };
    self._xLog.on(level, self._subs[level]);
  });
};

BusLog.prototype._unsubscribe = function () {
  Object.keys(this._subs)
    .filter((level) => !!this._subs[level])
    .forEach((level) => {
      this._xLog.removeListener(level, this._subs[level]);
      this._subs[level] = null;
    });
};

BusLog.prototype.log = function (mode, msg) {
  if (!this._resp || !this._resp.isConnected()) {
    return;
  }

  if (
    currentModes & modesEnum.overwatch &&
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

  if (currentModes & modesEnum.event) {
    this._resp.events.send('widget.text.' + mode, {
      prefix: prefix,
      mod: msg.module,
      text: msg.message,
    });
  }

  if (currentModes === 0) {
    this._unsubscribe();
  }
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

module.exports.addModes = function (modes) {
  if (modes === 0) {
    currentModes = ~0;
  } else {
    currentModes |= modes;
  }
};

module.exports.delModes = function (modes) {
  if (modes === 0) {
    currentModes = 0;
  } else {
    currentModes &= ~modes;
  }
};

module.exports.getModes = function () {
  return currentModes;
};

module.exports.modes = modesEnum;
