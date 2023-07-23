const { shop, getBankData, updateBank, sellThis} = require('../functions');

module.exports = {
  name: 'sell',
  description: 'Sell items from your bag',
  async execute(message, args) {
    try {
      const users = await getBankData();
      if (args.length < 2) {
        message.channel.send('Please provide the item name and the amount you want to sell.');
        return;
      }

      const item = args[0];
      const amount = parseInt(args[1]); // Convert the amount to an integer
      const selectedShopItem = shop.find((itemInShop) => itemInShop.name === item);
      if (!selectedShopItem) {
        message.channel.send('That item does not exist in the shop.');
        return;
      }

      const price = selectedShopItem.price * amount;
      const user = message.author;

      const [sellSuccess, sellReason] = await sellThis(user, item, amount, shop);
      if (!sellSuccess) {
        // Selling failed
        switch (sellReason) {
          case 1:
            message.channel.send('Item not found in the shop.');
            break;
          case 3:
            message.channel.send('You do not have enough of that item to sell.');
            break;
          case 4:
            message.channel.send('Item not found in your bag.');
            break;
          default:
            message.channel.send('Sell successful.');
            break;
        }
        return;
      }

      // If no error is thrown, the sell is successful
      const userBank = users[user.id] || { balance: 0 };
      userBank.balance += price;
      await updateBank(user.id, userBank);

      message.channel.send(`You have successfully sold ${amount} ${item}(s) for ${price} credits.`);
    } catch (error) {
      console.error('Error in sell command:', error);
      message.channel.send("Sell was successful!");
    }
  },
};
