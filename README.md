# xcraft-core-buslog

Bridge for the logs provided by `xcraft-core-log` and the Xcraft bus.

When a log is sent by `xcraft-core-log` and that busLog is available, then
the log is sent by event in the bus too.

These events are very useful for the UI in order to print the logs. Note
that these events are used by the `xcraft-contrib-gitlabci` module in order
to send the logs to the GitLab CI server too.

## Events

- `widget.text.verb`
- `widget.text.info`
- `widget.text.warn`
- `widget.text.err`
- `widget.progress`
