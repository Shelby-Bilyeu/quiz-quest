const Discord = require('discord.js');

module.exports = {
  name: 'shop',
  description: 'Display the shop with available items',
  async execute(message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Shop')
      .setDescription('Buy items with your trivia coins!')
      .addField('Trivia-Coin', 'A coin made of trivia questions price 50 :)')
      .addField('Trivia-Cake', 'A Cake made of knowledge price 100 :O');
    
    await message.channel.send(embed);
  },
};
