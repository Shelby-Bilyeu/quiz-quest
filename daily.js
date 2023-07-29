const { CooldownManager } = require('discord.js');
const { getBankData } = require('../functions');
const cooldowns = new CooldownManager();
const discord = require('discord.js');

module.exports = {
    name: 'daily',
    description: 'Get your daily reward',
    async execute(message) {
        const users = await getBankData();
        const userData = users[message.author.id];

        if (userData) {
            const cooldownTime = 8.64e+7;
            const cooldown = cooldowns.get(this.name);
            if (cooldown && cooldown.has(message.author.id)) {
                const expirationTime = cooldown.get(message.author.id) + cooldownTime;
                const timeLeft = (expirationTime - Date.now()) / 1000 / 60;
                return message.channel.send(`You can claim your daily reward again in ${timeLeft.toFixed(1)} minutes.`);
            }

            const reward = 1000;
            userData.bank += reward;
            await message.channel.send(`You claimed your daily reward of ${reward} trivia coins!`);
            await message.channel.send(`You now have ${userData.bank} trivia coins!`);
            cooldowns.set(this.name, message.author.id, Date.now());
        } else {
            message.channel.send('You do not have an account yet. Use ?start to create one.');
        }
    }
};