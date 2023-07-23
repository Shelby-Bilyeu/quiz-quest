const fs = require('fs');

const shop = [
    { name:'TriviaCoin', price: 50},
    { name: 'TriviaCake', price: 100 }
];

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
  getBankData,
  updateBank,
  buyThis,
  openAccount,
};