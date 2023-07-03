const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = '?'; // Set your desired prefix here
const commands = require('./commands');

client.once('ready', () => {
  console.log('Ready to Quest!');
  client.user.setActivity('?Quest to start Questing!', { type: 'LISTENING' });
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command in commands) {
    commands[command].execute(message, args); // Call the corresponding command's execute function
  }
});

client.login(config.token);

