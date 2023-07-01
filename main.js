const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');
const he = require('he');
const prefix = '?'; // Set your desired prefix here

client.once('ready', () => {
  console.log('Ready to riddle!');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'hello') {
    message.channel.send('Hello, there!');
  } else if (command === 'ping') {
    message.channel.send('Pong!');
  } 
  // using the given api create a quest command that will return a trivia question for the user to answer
  else if (command === 'quest') {
    const response = await axios.get('https://opentdb.com/api.php?amount=1');
    const question = he.decode(response.data.results[0].question);
    const answer = he.decode(response.data.results[0].correct_answer);
    embed = new Discord.MessageEmbed()
      .setTitle('A quest has appeared!')
      .setDescription(question)
      .setFooter('Answer Correctly to complete the quest!');
    message.channel.send(embed);
    const filter = (m) => m.author.id === message.author.id;
    message.channel
      .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
      .then((collected) => {
        if (collected.first().content.toLowerCase() === answer.toLowerCase()) {
          message.channel.send('You have completed the quest!');
        } else {
          message.channel.send('You have failed the quest!');
        }
      }
      )
      .catch((collected) => {
        message.channel.send('You have failed the quest!');
      }
      );
      
    
  }
  
  // Add more commands here if needed
});

client.login(config.token);
