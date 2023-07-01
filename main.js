const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const prefix = '?'; // Set your desired prefix here

client.once('ready', () => {
  console.log('Ready to riddle!');
});

client.on('message', (message) => {
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
  // Add more commands here if needed

});

client.login(config.token);
