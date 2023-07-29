const fs = require('fs');
const { getBankData, updateBank, openAccount } = require('../functions');


module.exports = {
  name: 'start',
  description: 'Create an account to start your adventure',
  execute(message) {

    openAccount(message.author)
      .then((accountCreated) => {
        if (!accountCreated) {
          message.channel.send('You already have an account!');
        } else {
          message.channel.send('Your account has been created! You can now start your adventure with ?quest!');
        }
      })
      .catch((error) => {
        console.error('Error creating account:', error);
        message.channel.send('Oops! An error occurred while creating your account.');
      });
  },
};
