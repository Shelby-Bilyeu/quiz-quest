const fs = require('fs');

module.exports = {
  name: 'start',
  description: 'Create an account to start your adventure',
  execute(message) {
    async function openAccount(user) {
      const users = await getBankData();

      if (String(user.id) in users) {
        return false;
      } else {
        users[String(user.id)] = {};
        users[String(user.id)]["bank"] = 0;
      }

      fs.writeFileSync('bank.json', JSON.stringify(users));
      return true;
    }

    async function getBankData() {
      const rawdata = fs.readFileSync('bank.json');
      const users = JSON.parse(rawdata);
      return users;
    }

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
