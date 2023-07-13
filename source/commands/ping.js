// Import
const { SlashCommandBuilder } = require('discord.js');

// The response of the bot in chat
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Returns the bot's ping!"),
    async execute(interaction, client) {
        const message = await interaction.deferReply({ fetchReply: true });

        const newMessage = `Client ping: ${message.createdTimestamp - interaction.createdTimestamp}ms \n API Latency: ${Math.round(client.ws.ping)}ms`;
        await interaction.editReply(newMessage);
        console.log(`Command "${this.data.name}" has been executed by ${interaction.user.username} in #${interaction.channel.name} on ${interaction.guild.name}💡`);
    }
}
