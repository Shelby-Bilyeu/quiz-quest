const fs = require('fs');
const Discord = require('discord.js');

const animals = [
  { name: 'Cat', level: 1, health: 100, attack: 20, defense: 10 },
  { name: 'Dog', level: 1, health: 120, attack: 18, defense: 12 },
  { name: 'Bird', level: 1, health: 80, attack: 22, defense: 8 },
  { name: 'Rabbit', level: 1, health: 90, attack: 15, defense: 15 },
  { name: 'Fish', level: 1, health: 50, attack: 10, defense: 5 },
];

module.exports = {
  name: 'hatch',
  description: 'Hatch your egg and reveal the animal inside!',
  async execute(message) {
    try {
      const user = message.author;
      const userData = await getBankData();
      const userBank = userData[user.id] || { bank: 0, bag: [], pets: [] };
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

      // Add the hatched animal to the user's pets
      const petIndex = userBank.pets.findIndex(pet => pet.name === randomAnimal.name);
      if (petIndex !== -1) {
        // If the pet already exists, update its stats and level
        userBank.pets[petIndex].level = randomAnimal.level;
        userBank.pets[petIndex].health = randomAnimal.health;
        userBank.pets[petIndex].attack = randomAnimal.attack;
        userBank.pets[petIndex].defense = randomAnimal.defense;
      } else {
        // If the pet doesn't exist, add it to the user's pets with its stats
        userBank.pets.push({
          name: randomAnimal.name,
          level: randomAnimal.level,
          health: randomAnimal.health,
          attack: randomAnimal.attack,
          defense: randomAnimal.defense,
        });
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
          .setDescription(`:hatched_chick: Your egg hatched into a level ${randomAnimal.level} ${randomAnimal.name}!\nStats: Health: ${randomAnimal.health}, Attack: ${randomAnimal.attack}, Defense: ${randomAnimal.defense}`)
          .setColor('#00ff00')
      );
    } catch (error) {
      console.error('Error in hatch command:', error);
      message.channel.send('An error occurred during the hatching process.');
    }
  },
};

async function getBankData() {
  const rawData = fs.readFileSync('bank.json');
  return JSON.parse(rawData);
}
