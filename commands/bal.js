const fs = require('fs');
const { getBankData, updateBank } = require('../functions');

module.exports = {
  name: 'bal',
  description: 'Check your trivia coins balance',
  async execute(message) {
    const users = await getBankData();

    if (String(message.author.id) in users) {
      const bal = await updateBank(message.author);
      message.channel.send(`You have ${bal} trivia coins!`);
    } else {
      message.channel.send('You do not have an account! Create one with ?start');
    }
  },
};
