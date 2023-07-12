// Imports
require('dotenv').config();
const  token = process.env.TOKEN;
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');

// Create and configure the client
const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.events = new Collection();
client.commandArray = [];

// Get the right folders and files
const functionFolders = fs.readdirSync('./source/functions');
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./source/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) {
      require(`./functions/${folder}/${file}`)(client);
    }
}

// Start the bot
client.handleEvents();
client.handleCommands();
client.login(token);
client.once('ready', () => {
  console.log('Editing status ...');
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: "Mochi's cute face🤎",
      // url: 'https://youtu.be/O5PQxNX8OAY',
      type: ActivityType.Watching
      // emoji: '🤎',
      
    }]
  });
});