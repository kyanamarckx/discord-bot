// Imports
const fs = require('fs');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Create the handleCommands function
module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFiles = fs.readdirSync('C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\mochi bot\\source\\commands').filter(file => file.endsWith('.js'));
    const { commands, commandArray } = client;

    for (const file of commandFiles) {
      const command = require(`C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\mochi bot\\source\\commands\\${file}`);
      commands.set(command.data.name, command);
      commandArray.push(command.data.toJSON());
      console.log(`Loaded command "${command.data.name}" has passed through the command handler🤖`)
    }

    const clientID = '1127682126389706864';
    const guildID = '1127684211432759308';
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    try {
      console.log('Started refreshing application (/) commands🔄');

      await rest.put(
        Routes.applicationGuildCommands(clientID, guildID),
        { body: client.commandArray },
      );

      console.log('Successfully reloaded application (/) commands✅');
    } catch (error) {
      console.error(error);
    }
  }
}