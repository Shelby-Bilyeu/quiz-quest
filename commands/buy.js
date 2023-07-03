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

async function buyThis(user, itemName, amount) {
  const lowerItemName = itemName.toLowerCase();
  let name_ = null;

  for (const item of shop) {
    const name = item["name"].toLowerCase();
    if (name === lowerItemName) {
      name_ = name;
      const price = item["price"];
      break;
    }
  }

  // Implement the logic to buy an item
  // Return true if successful, false otherwise
  return false;
}
store = [ { name: 'Trivia-Coin', price: 50 }, { name: 'Trivia-Cake', price: 100 }]

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  async execute(message, args) {
    const itemName = args[0];
    const amount = args[1];

    if (!itemName) {
      message.channel.send('Please specify an item to buy!');
    } else if (!amount) {
      message.channel.send('Please specify an amount to buy!');
    } else {
      const itemBought = await buyThis(message.author, itemName, amount);
      if (!itemBought) {
        message.channel.send('Item not found or you do not have enough trivia coins!');
      } else {
        message.channel.send(`You have bought ${amount} ${itemName}(s)!`);
      }
    }
  },
};
