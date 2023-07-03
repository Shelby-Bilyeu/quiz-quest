module.exports = {
  name: 'hello',
  description: 'Say hello',
  execute(message) {
    message.channel.send('Hello, there!');
  },
};

  