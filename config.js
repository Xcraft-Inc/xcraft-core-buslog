'use strict';

/**
 * Retrieve the inquirer definition for xcraft-core-etc
 */
module.exports = [{
  type: 'input',
  name: 'blacklist',
  message: 'list of blacklisted modules',
  default: 'bus,busclient,server'
}];
