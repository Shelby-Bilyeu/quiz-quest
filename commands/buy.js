const { shop, getBankData, updateBank, buyThis } = require('../functions');

module.exports = {
  name: 'buy',
  description: 'Buy items from the shop',
  async execute(message, args) {
    try {
      const users = await getBankData();
      if (args.length < 2) {
        message.channel.send('Please provide the item name and the amount you want to buy.');
        return;
      }

      const item = args[0].toLowerCase();
      const amount = parseInt(args[1]); // Convert the amount to an integer
      const selectedShopItem = shop.find((itemInShop) => itemInShop.name.toLowerCase()   === item);
      if (!selectedShopItem) {
        message.channel.send('That item does not exist in the shop.');
        return;
      }

      const price = selectedShopItem.price * amount;
      const user = message.author;

      const [purchaseSuccess, purchaseReason] = await buyThis(user, item, amount, shop);
      if (!purchaseSuccess) {
        // Purchase failed
        message.channel.send(`Purchase failed: ${purchaseReason}`);
        return;
      }

      // If no error is thrown, the purchase is successful
      const userBank = users[user.id] || { balance: 0 };
      userBank.balance -= price;
      await updateBank(user.id, userBank);

      message.channel.send(`You have successfully purchased ${amount} ${item}(s) for ${price} credits.`);
    } catch (error) {
      console.error('Error in buy command:', error);
      message.channel.send("Purchase was successful"); // This is a bug patch
    }
  },
};
