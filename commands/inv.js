const { getBankData } = require('../functions');
const Discord = require('discord.js');

module.exports = {
  name: 'inv',
  description: 'Shows your inventory or another user\'s inventory',
  async execute(message, args) {
    try {
      let targetUser = message.author;
      
      // Check if the command has an argument (a mentioned user)
      if (args.length > 0) {
        const userMention = args[0].match(/^<@!?(\d+)>$/);
        if (userMention) {
          const userID = userMention[1];
          targetUser = message.guild.members.cache.get(userID).user;
        }
      }

      const userData = await getBankData();
      const userBank = userData[targetUser.id] || { bank: 0, bag: [] };
      const userInv = userBank.bag || [];

      // Create a list of bag items with their amounts
      const invItems = userInv.map(item => `${item.item}: ${item.amount}`);
      const invList = invItems.join('\n');

      const embed = new Discord.MessageEmbed()
        .setTitle('Inventory')
        .addField(`${targetUser.tag}'s Inventory`, invList || 'Your bag is empty add items with ?buy <item> <amount>')
        .setFooter('Use ?sell <item> <amount> to sell an item from your bag.')
        .setColor('#0099ff');

      message.channel.send(embed);
    } catch (error) {
      console.error('Error in inv command:', error);
      message.channel.send('An error occurred while fetching the inventory.');
    }
  },
};
