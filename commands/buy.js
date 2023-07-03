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

async function buyThis(user, item_name, amount) {
  item_name = item_name.toLowerCase();
  let name_ = null;
  for (let item of shop) {
      let name = item["name"].toLowerCase();
      if (name === item_name) {
          name_ = name;
          let price = item["price"];
          break;
      }
  }
  
  if (name_ === null) {
      return [false, 1];
  }
  
  let cost = price * amount;
  
  let users = await getBankData();
  
  let bal = await updateBank(user);
  
  if (bal[0] < cost) {
      return [false, 2];
  }
  
  try {
      let index = 0;
      let t = null;
      for (let thing of users[String(user.id)]['bag']) {
          let n = thing['item'];
          if (n === item_name) {
              let old_amt = thing['amount'];
              let new_amt = old_amt + amount;
              users[String(user.id)]['bag'][index]['amount'] = new_amt;
              t = 1;
              break;
          }
          index += 1;
      }
      if (t === null) {
          let obj = {"item": item_name, "amount": amount};
          users[String(user.id)]["bag"].push(obj);
      }
  } catch {
      let obj = {"item": item_name, "amount": amount};
      users[String(user.id)]["bag"] = [obj];
  }
  
  fs.writeFileSync("bank.json", JSON.stringify(users));
  
  await updateBank(user, cost * -1, "bank");
  
  return [true, "Worked"];
}

store = [ { name: 'Trivia-Coin', price: 50 }, { name: 'Trivia-Cake', price: 100 }]

//create the command so that users can buy items from the shop and have it added to their inventory 
module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide the name of the item you want to buy!');
    }

    const itemName = args[0];
    const amount = args[1] || 1;

    const success = await buyThis(message.author, itemName, amount);

    if (success) {
      message.channel.send(`You have successfully bought ${amount} ${itemName}!`);
    } else {
      message.channel.send(`Oops! There was an error while buying ${amount} ${itemName}.`);
    }
  }
};
