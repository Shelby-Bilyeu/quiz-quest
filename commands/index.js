const questCommand = require('./quest.js');
const balCommand = require('./bal.js');
const buyCommand = require('./buy.js');
const pingCommand = require('./ping.js');
const shopCommand = require('./shop.js');
const helloCommand = require('./hello.js');
const startCommand = require('./start.js');
const sellCommand = require('./sell.js');

module.exports = {
  quest: questCommand,
  bal: balCommand,
  buy: buyCommand,
  ping: pingCommand,
  shop: shopCommand,
  hello: helloCommand,
  start: startCommand,
  sell: sellCommand,
  
  // Add more commands here
};
