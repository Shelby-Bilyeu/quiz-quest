const fs = require('fs');

const shop = [
  { name: 'TriviaCoin', price: 50 },
  { name: 'TriviaCake', price: 100 },
  { name: 'Egg', price: 200 }, // Add the egg to the shop
];

const animals = ['Cat', 'Dog', 'Bird', 'Rabbit', 'Fish'];

async function getBankData() {
    const rawdata = fs.readFileSync('bank.json');
    const users = JSON.parse(rawdata);
    return users;
}

async function updateBank(user, change = 0, mode = 'bank') {
  try {
    const users = await getBankData();
    if (!users || !users[String(user.id)] || !users[String(user.id)][mode]) {
      throw new Error(`User or property not found for user ID: ${user.id}`);
    }

    users[String(user.id)][mode] += change;

    fs.writeFileSync('bank.json', JSON.stringify(users));

    const bal = [users[String(user.id)]["bank"]];
    return bal;
  } catch (error) {
    console.error('Error in updateBank:', error);
    throw new Error('Error updating bank data.');
  }
}

async function buyThis(user, item_name, amount, shop) {
    item_name = item_name.toLowerCase();
    let foundItem = null;
    let price = 0;
  
    for (let item of shop) {
      let name = item["name"].toLowerCase();
      if (name === item_name) {
        foundItem = item;
        price = item["price"];
        break;
      }
    }
  
    if (foundItem === null) {
      return [false, 1]; // Item not found error code
    }
  
    let cost = price * amount;
  
    let users = await getBankData();
  
    let bal = await updateBank(user, 0, "bank");
  
    if (bal[0] < cost) {
      return [false, 2]; // Insufficient funds error code
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
    } catch (error) {
      let obj = {"item": item_name, "amount": amount};
      users[String(user.id)]["bag"] = [obj];
    }
  
    fs.writeFileSync("bank.json", JSON.stringify(users));
  
    await updateBank(user, cost * -1, "bank");
  
    return [true, "Worked"]; // Purchase successful
}
async function sellThis(user, item_name, amount, shop) {
    item_name = item_name.toLowerCase();
    let foundItem = null;
    let price = 0;
  
    for (let item of shop) {
      let name = item["name"].toLowerCase();
      if (name === item_name) {
        foundItem = item;
        price = item["price"];
        break;
      }
    }
  
    if (foundItem === null) {
      return [false, 1]; // Item not found error code
    }
  
    let cost = price * amount;
  
    let users = await getBankData();
  
    try {
      let userBag = users[String(user.id)]["bag"];
      let itemIndex = -1;
      for (let i = 0; i < userBag.length; i++) {
        if (userBag[i].item === item_name) {
          if (userBag[i].amount >= amount) {
            itemIndex = i;
            break;
          } else {
            return [false, 3]; // Insufficient amount of items to sell error code
          }
        }
      }
  
      if (itemIndex === -1) {
        return [false, 4]; // Item not found in user's bag error code
      }
  
      users[String(user.id)]["bag"][itemIndex].amount -= amount;
      if (users[String(user.id)]["bag"][itemIndex].amount === 0) {
        users[String(user.id)]["bag"].splice(itemIndex, 1);
      }
  
      fs.writeFileSync("bank.json", JSON.stringify(users));
  
      await updateBank(user, cost, "bank"); // Increase the user's bank balance
  
      return [true, "Worked"]; // Sell successful
    } catch (error) {
      console.error('Error in sellThis:', error);
      throw new Error('Error selling item.');
    }
  }
  
  
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


module.exports = {
  shop,
  animals,
  getBankData,
  updateBank,
  buyThis,
  openAccount,
  sellThis,
};