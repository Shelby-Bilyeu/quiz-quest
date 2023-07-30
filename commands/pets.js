const { getBankData } = require('../functions');
const Discord = require('discord.js');

const PETS_PER_PAGE = 10;

module.exports = {
  name: 'pets',
  description: 'Check your pets',

  async execute(message) {
    try {
      const users = await getBankData();
      const userData = users[message.author.id];

      if (!userData) {
        await message.channel.send('You do not have an account yet. Use ?start to create one.');
        return;
      }

      const pets = userData.pets || [];

      if (pets.length === 0) {
        await message.channel.send('You have no pets yet. Hatch an egg using ?hatch to get one!');
        return;
      }

      const totalPages = Math.ceil(pets.length / PETS_PER_PAGE);
      let page = parseInt(message.content.split(' ')[1], 10) || 1;

      if (page < 1 || page > totalPages) {
        page = 1;
      }

      const startIndex = (page - 1) * PETS_PER_PAGE;
      const endIndex = Math.min(startIndex + PETS_PER_PAGE, pets.length);
      const currentPets = pets.slice(startIndex, endIndex);

      const embed = new Discord.MessageEmbed()
        .setTitle(`Pets :dog: - Page ${page}/${totalPages}`)
        .setColor('#0099ff')
        .setFooter(`You have a total of ${pets.length} pets. Use ?pets <page number> to view a different page of pets.`);

      currentPets.forEach((pet, index) => {
        embed.addField(
          `Pet ${startIndex + index + 1}: ${pet.name} (Level ${pet.level})`,
          `Health: ${pet.health}, Attack: ${pet.attack}, Defense: ${pet.defense}`,
          true
        );
      });

      await message.channel.send(embed);
    } catch (error) {
      console.error('Error in pets command:', error);
      await message.channel.send('An error occurred while fetching your pets.');
    }
  },
};
