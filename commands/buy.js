const fs = require('fs');
const {getBankData, updateBank, buyThis, shop} = require('../functions');

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide the name of the item you want to buy!');
    }

    const itemName = args[0];
    const amount = args[1] || 1;

    const success = await buyThis(message.author, itemName, amount, shop); // Pass the 'shop' data as an argument.

    if (success[0]) { // Check the first element of the 'success' array to determine if the purchase was successful.
      message.channel.send(`You have successfully bought ${amount} ${itemName}!`);
    } else {
      const errorCode = success[1];
      if (errorCode === 1) {
        message.channel.send(`Oops! The item "${itemName}" is not available in the shop.`);
      } else if (errorCode === 2) {
        message.channel.send(`Oops! You don't have enough money to buy ${amount} ${itemName}.`);
      } else {
        message.channel.send('Oops! There was an error while processing your request.');
      }
    }
  }
};