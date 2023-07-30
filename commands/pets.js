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

      const page = parseInt(message.content.split(' ')[1], 10) || 1;
      const totalPages = Math.ceil(pets.length / PETS_PER_PAGE);

      if (page < 1 || page > totalPages) {
        await message.channel.send(`Invalid page number. Please enter a page between 1 and ${totalPages}.`);
        return;
      }

      const startIndex = (page - 1) * PETS_PER_PAGE;
      const endIndex = Math.min(startIndex + PETS_PER_PAGE, pets.length);
      const currentPets = pets.slice(startIndex, endIndex);

      const embed = new Discord.MessageEmbed()
        .setTitle(`Pets :dog: - Page ${page}/${totalPages}`)
        .setColor('#0099ff')
        .setFooter('Use ?pets <page number> to view a different page of pets.');

      // Loop through the currentPets array, adding two columns of five pets each
      for (let i = 0; i < 2; i++) {
        const columnContent = [];

        for (let j = 0; j < 5; j++) {
          const petIndex = i * 2 + j;
          const pet = currentPets[petIndex];

          if (pet) {
            columnContent.push(
              `Pet ${startIndex + petIndex + 1}: ${pet.name} (Level ${pet.level})\nHealth: ${pet.health}, Attack: ${pet.attack}, Defense: ${pet.defense}`
            );
          } else {
            columnContent.push('\u200b'); // Empty field to maintain the grid structure
          }
        }

        // Add the fields for the current column to the embed
        embed.addField(`Column ${i + 1}`, columnContent.join('\n\n'), true);
      }

      await message.channel.send(embed);
    } catch (error) {
      console.error('Error in pets command:', error);
      await message.channel.send('An error occurred while fetching your pets.');
    }
  },
};
