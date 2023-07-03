module.exports = {
    name: 'ping',
    description: 'Ping command to check if the bot is responsive',
    execute(message, args) {
      message.channel.send('Pong!');
    },
  };
  
