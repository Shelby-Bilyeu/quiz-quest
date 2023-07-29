const fs = require('fs');
const { getBankData } = require('../functions');
const Discord = require('discord.js');

// Create a Map to store cooldowns
const cooldowns = new Map();

module.exports = {
  name: 'daily',
  description: 'Get your daily reward',
  async execute(message) {
    try {
      const users = await getBankData();
      const userData = users[message.author.id];

      if (userData) {
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const cooldown = cooldowns.get(this.name);

        if (cooldown && cooldown.has(message.author.id)) {
          const expirationTime = cooldown.get(message.author.id) + cooldownTime;
          const timeLeft = (expirationTime - Date.now()) / 1000 / 60;
          return message.channel.send(`You can claim your daily reward again in ${timeLeft.toFixed(1)} minutes.`);
        }

        const reward = 1000;
        userData.bank += reward;
        embed = new Discord.MessageEmbed()
          .setTitle('Daily :moneybag:')
          .setDescription(`You claimed your daily reward of ${reward} trivia coins!`)
          .setColor('#0099ff')
          .setFooter(`You now have ${userData.bank} trivia coins!`);
        message.channel.send(embed);

        // Set the cooldown for the user
        cooldowns.set(this.name, new Map([[message.author.id, Date.now()]]));

        // Remove the cooldown after the specified time
        setTimeout(() => {
          cooldowns.get(this.name).delete(message.author.id);
        }, cooldownTime);
        
        // Save the updated user data
        fs.writeFileSync('bank.json', JSON.stringify(users));
      } else {
        message.channel.send('You do not have an account yet. Use ?start to create one.');
      }
    } catch (error) {
      console.error('Error in daily command:', error);
      message.channel.send('An error occurred while processing your daily reward.');
    }
  },
};
