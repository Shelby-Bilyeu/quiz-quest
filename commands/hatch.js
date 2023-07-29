const fs = require('fs');
const Discord = require('discord.js');
const { getBankData, updateBank } = require('../functions');

const animals = ['Cat', 'Dog', 'Bird', 'Rabbit', 'Fish'];

module.exports = {
  name: 'hatch',
  description: 'Hatch your egg and reveal the animal inside!',
  async execute(message) {
    try {
      const user = message.author;
      const userData = await getBankData();
      const userBank = userData[user.id] || { bank: 0, bag: [] };
      const userInv = userBank.bag || [];

      // Find the index of the Egg in the user's inventory (case-sensitive comparison)
      const eggIndex = userInv.findIndex(item => item.item === 'egg');
      if (eggIndex === -1) {
        message.channel.send("You don't have an Egg to hatch.");
        return;
      }

      // Generate a random animal from the 'animals' array
      const randomIndex = Math.floor(Math.random() * animals.length);
      const randomAnimal = animals[randomIndex];

      // Check if the hatched animal already exists in the user's inventory
      const existingAnimalIndex = userInv.findIndex(item => item.item === randomAnimal);
      if (existingAnimalIndex !== -1) {
        // Increment the amount of the existing animal in the inventory
        userInv[existingAnimalIndex].amount++;
      } else {
        // Add the hatched animal to the user's inventory
        userInv.push({ item: randomAnimal, amount: 1 });
      }

      // Subtract one egg from the user's inventory
      if (userInv[eggIndex].amount > 1) {
        userInv[eggIndex].amount--;
      } else {
        // If the egg's amount is 1 or less, remove the egg from the inventory
        userInv.splice(eggIndex, 1);
      }

      // Save the updated user data
      fs.writeFileSync('bank.json', JSON.stringify(userData));

      // Send a message to notify the user that their Egg hatched
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('Congratulations! Your Egg Hatched!')
          .setDescription(`:hatched_chick: Your egg hatched into a ${randomAnimal}!`)
          .setColor('#00ff00')
      );
    } catch (error) {
      console.error('Error in hatch command:', error);
      message.channel.send('An error occurred during the hatching process.');
    }
  },
};
