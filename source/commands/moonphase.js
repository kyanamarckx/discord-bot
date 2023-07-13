// Imports
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
import("node-fetch");
require('dotenv').config();
const appID = process.env.APPLICATION_ID;
const appSecret = process.env.APPLICATION_SECRET;

// Variables
const jsonPath = 'C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\mochi bot\\data\\moonphase.json';
const authString = btoa(`${appID}:${appSecret}`);
const bodiesLink = "https://api.astronomyapi.com/api/v2/bodies";


// Functions
// Get the available bodies from the API and save it to a json file
async function saveBodies() {
  fetch(bodiesLink, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authString}`
    }
  })
    .then(response => {
      if (response.status !== 200) {
        console.log('Unexpected Status code:', response.status);
      }
      return response.text();
    })
    .then(jsonData => {
      if (!jsonData) {
        console.error('JSON data is empty.');
      }
      fs.writeFile(jsonPath, jsonData, err => {
        if (err) {
          console.error(err);
        }
        console.log('Data saved successfully.');
      })

      return jsonData;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Read the json file
async function getBodies(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        let filteredData = parsedData.data.bodies.filter(body => {
          return body.length > 0;
        });
        console.log(filteredData);

        let i = 1;
        filteredData = filteredData.map(entry => {
          return `**${i++}**: ${entry}`;
        }).join('\n');

        resolve(filteredData);
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Combine the three functions above
async function saveAndGetBodies(path) {
  await saveBodies();
  await delay(3500);
  const bodies = await getBodies(path);
  return bodies;
}


// The response of the bot in chat
module.exports = {
  data: new SlashCommandBuilder()
    .setName('moonphase')
    .setDescription('Get the current moon phase.')
    .addStringOption(option => option
      .setName('function')
      .setDescription('Select which functionality u want to use:')
      .setRequired(true)
      .addChoices({
        name: 'Get the available bodies in the universe', value: 'bodies',
      })),
  async execute(interaction) {
    await interaction.deferReply({ fetchReply: true });
    const functionChoice = interaction.options.getString('function');

    if (functionChoice === 'bodies') {
    const body = await saveAndGetBodies(jsonPath);
    await interaction.editReply(`The available bodies are: \n${body}`);
    }

    console.log(`Command "${this.data.name}" has been executed by ${interaction.user.username} in #${interaction.channel.name} on ${interaction.guild.name}🌘`);
  }
}