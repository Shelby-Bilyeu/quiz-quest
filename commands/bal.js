const fs = require('fs');

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

async function updateBank(user, change = 0, mode = 'bank') {
  const users = await getBankData();
  users[String(user.id)][mode] += change;

  fs.writeFileSync('bank.json', JSON.stringify(users));

  const bal = [users[String(user.id)]["bank"]];
  return bal;
}

module.exports = {
  name: 'bal',
  description: 'Check your trivia coins balance',
  async execute(message) {
    const users = await getBankData();

    if (String(message.author.id) in users) {
      const bal = await updateBank(message.author);
      message.channel.send(`You have ${bal} trivia coins!`);
    } else {
      message.channel.send('You do not have an account! Create one with ?start');
    }
  },
};
