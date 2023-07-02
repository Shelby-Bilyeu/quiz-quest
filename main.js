
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');
const he = require('he');
const prefix = '?'; // Set your desired prefix here
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

  // Rest of your code...

  // Make sure to define the 'shop' array before using it in the 'buyThis' function.

  // Example:
  const shop = [
    {
      name: 'item1',
      price: 10
    },
    {
      name: 'item2',
      price: 20
    },
    // Add more items here...
  ];
}

client.once('ready', () => {
  console.log('Ready to Quest!');
  client.user.setActivity('?Quest to start Questing!', { type: 'LISTENING' });
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'hello') {
    message.channel.send('Hello, there!');
  } else if (command === 'ping') {
    message.channel.send('Pong!');
  } else if (command === 'quest') {
    const users = await getBankData();

    if (String(message.author.id) in users) {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const question = he.decode(response.data.results[0].question);
        const choices = response.data.results[0].incorrect_answers.map(he.decode);
        const correctAnswer = he.decode(response.data.results[0].correct_answer);

        choices.push(correctAnswer);
        choices.sort(); // Sort the choices alphabetically

        const embed = new Discord.MessageEmbed()
          .setTitle('A quest has appeared!')
          .setDescription(question)
          .addField('Choices', choices.join('\n'))
          .setFooter('Answer correctly to complete the quest!');

        message.channel.send(embed);

        const filter = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then((collected) => {
            if (collected.first().content.toLowerCase() === correctAnswer.toLowerCase()) {
              message.channel.send('You have completed the quest! You have earned 100 trivia coins!'); 
              updateBank(message.author, 100, 'bank');  
            } else {
              message.channel.send('You have failed the quest!');
            }
          })
          .catch((collected) => {
            message.channel.send('You have failed the quest!');
          });
      } catch (error) {
        console.error('Error fetching quest:', error);
        message.channel.send('Oops! An error occurred while fetching the quest.');
      }
    } else {
      message.channel.send('You do not have an account! Create one with ?start');
    }
  } else if (command === 'start') {
    const accountCreated = await openAccount(message.author);
    if (!accountCreated) {
      message.channel.send('You already have an account!');
    } else {
      message.channel.send('Your account has been created! You can now start your adventure with ?quest!');
    }
  } else if (command === 'bal') {
    const users = await getBankData();

    if (String(message.author.id) in users) {
      const bal = await updateBank(message.author);
      message.channel.send(`You have ${bal} trivia coins!`);
    } else {
      message.channel.send('You do not have an account! Create one with ?start');
    }
  }

  // Add more commands here if needed
});

client.login(config.token);

