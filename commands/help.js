const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all commands',
  async execute(message) {
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle('Bot Commands')
    .setColor('#0099ff')
    .addField('?start', 'Start your adventure!')
    .addField('?ping', 'Sends pong!')
    .addField('?quest', 'Begins a quest!')
    .addField('?shop', 'Shows the shop!')
    .addField('?buy <item> <ammount>', 'Buys an item from the shop!')
    .addField('?sell <item> <ammount>', 'Sells an item from your bag!')
    .addField('?hello', 'Say hello to the bot!')
    .addField('?balance', 'Shows your balance!')
    .setFooter('Replace this text with any additional footer or information.');

    message.channel.send(helpEmbed);
  },
};
