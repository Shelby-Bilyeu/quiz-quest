
const fs = require('fs');
const Discord = require('discord.js');
const { getBankData } = require('../functions');

module.exports = {
  name: 'bal',
  description: 'Check your trivia coins balance',
  async execute(message) {
    const users = await getBankData();
    const userData = users[message.author.id];

    if (userData) {
      const balance = userData.bank || 0;
      const embed = new Discord.MessageEmbed()
        .setTitle('Bank :moneybag:')
        .setDescription(`You have ${balance} trivia coins!`)
        .setColor('#0099ff')
        .setFooter('Use ?quest to earn more trivia coins.');

      message.channel.send(embed);
    } else {
      message.channel.send('You do not have an account yet. Use ?start to create one.');
    }
  },
};

