const fs = require('fs');
const axios = require('axios');
const he = require('he');
const Discord = require('discord.js');
const { getBankData, updateBank } = require('../functions');


module.exports = {
  name: 'quest',
  description: 'Start a quest',
  async execute(message, args) {
    const users = await getBankData();

    if (String(message.author.id) in users) {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const question = he.decode(response.data.results[0].question);
        const choices = response.data.results[0].incorrect_answers.map(he.decode);
        const correctAnswer = he.decode(response.data.results[0].correct_answer);

        choices.push(correctAnswer);
        choices.sort(); // Sort the choices alphabetically

        const embed = new Discord.MessageEmbed()
          .setTitle('A quest has appeared!')
          .setDescription(question)
          .addField('Choices', choices.join('\n'))
          .setFooter('Answer correctly to complete the quest!');

        message.channel.send(embed);

        const filter = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then((collected) => {
            if (collected.first().content.toLowerCase() === correctAnswer.toLowerCase()) {
              message.channel.send('You have completed the quest! You have earned 100 trivia coins!');
              updateBank(message.author, 100, 'bank');
            } else {
              message.channel.send('You have failed the quest!');
            }
          })
          .catch((collected) => {
            message.channel.send('You have failed the quest!');
          });
      } catch (error) {
        console.error('Error fetching quest:', error);
        message.channel.send('Oops! An error occurred while fetching the quest.');
      }
    } else {
      message.channel.send('You do not have an account! Create one with ?start');
    }
  },
};