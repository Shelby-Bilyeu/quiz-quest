const fs = require('fs');
const path = require('path');
const { getBankData } = require('../functions');
const Discord = require('discord.js');

module.exports = {
  name: 'bal top',
  description: 'Show the leaderboard of users with the highest trivia coins balance',
  async execute(message) {
    try {
      const serverId = message.guild.id;
      const serverDataFolder = path.join(__dirname, '..', 'serverdata');
      if (!fs.existsSync(serverDataFolder)) {
        fs.mkdirSync(serverDataFolder);
      }

      const leaderboardFilePath = path.join(serverDataFolder, `leaderboard_${serverId}.json`);

      // Read the leaderboard data for the current server
      let leaderboardData = [];
      if (fs.existsSync(leaderboardFilePath)) {
        const rawdata = fs.readFileSync(leaderboardFilePath);
        leaderboardData = JSON.parse(rawdata);
      } else {
        // Create an empty leaderboard file for the server
        fs.writeFileSync(leaderboardFilePath, '[]');
      }

      const users = await getBankData();

      // Filter and map only the members who are part of the server
      const members = message.guild.members.cache.filter(member => !member.user.bot);

      // Convert the user data object into an array of objects for members in the server
      const userDataArray = members.map(member => ({
        userId: member.id,
        balance: (users[member.id]?.bank || 0),
        displayName: member.displayName,
      }));

      // Sort the user data array based on the balance in descending order
      userDataArray.sort((a, b) => b.balance - a.balance);

      // Update the leaderboard data for the current server
      leaderboardData = userDataArray.slice(0, 25).map(user => ({
        userId: user.userId,
        displayName: user.displayName || 'Unknown User',
        balance: user.balance,
      }));

      // Save the updated leaderboard data to the file
      fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboardData));

      // Create a leaderboard message
      let leaderboardMessage = '```css\n'; // Use CSS formatting for a code block in Discord
      leaderboardData.forEach((user, index) => {
        const userDisplayName = user.displayName !== 'Unknown User' ? user.displayName : 'User#' + (index + 1);
        leaderboardMessage += `${index + 1}. ${userDisplayName}: ${user.balance} trivia coins\n`;
      });
      leaderboardMessage += '```';

      // Send the leaderboard message
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('Trivia Coins Leaderboard :trophy:')
          .setDescription(leaderboardMessage)
          .setColor('#0099ff')
      );
    } catch (error) {
      console.error('Error in bal top command:', error);
      message.channel.send('An error occurred while fetching the leaderboard.');
    }
  },
};