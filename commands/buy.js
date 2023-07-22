const fs = require('fs');
const { getBankData, updateBank, shop } = require('../functions');

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide the name of the item you want to buy!');
    }

    const itemName = args[0];
    const amount = args[1] || 1;

    const success = await buyThis(message.author, itemName, amount);

    if (success) {
      message.channel.send(`You have successfully bought ${amount} ${itemName}!`);
    } else {
      message.channel.send(`Oops! There was an error while buying ${amount} ${itemName}.`);
    }
  }
};
