const Discord = require('discord.js');
const { shop } = require('../functions');



module.exports = {
  name: 'shop',
  description: 'Display the shop with available items',
  async execute(message) {
    const shopItems = shop.map(item => `${item.name}: ${item.price} coins`);
    const shopList = shopItems.join('\n');

    const embed = new Discord.MessageEmbed()
      .setTitle('Shop')
      .addField('Items', shopList)
      .setFooter('Use ?buy <item> <amount> to buy an item from the shop.')
      .setColor('#0099ff');
    
    await message.channel.send(embed);
  },
};
