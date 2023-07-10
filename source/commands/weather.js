// Imports
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const csv = require('csv-parser');
import("node-fetch");

// Variables
const csvPath = 'C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\weather\\data\\weather.csv';
const selectedColumns = ['name', 'datetime', 'tempmax'];
const location = 'Cotignac';


// Functions
// Fetch the weather from the API and save it to a CSV file
async function getWeather() {
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv`)
    .then(response => {
      if (response.status !== 200) {
        console.log('Unexpected Status code:', response.status);
      }
      return response.text();
    })
    .then(csvData => {
      if (!csvData) {
        console.error('CSV data is empty.');
      }
      fs.writeFile('C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\weather\\data\\weather.csv', csvData, err => {
        if (err) {
          console.error(err);
        }
        console.log('Data saved successfully.');
      })

      return csvData;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Get the data from the CSV file
async function getDataFromCSV(csvFilePath, columns) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const selectedRow = {};
        columns.forEach(column => {
          selectedRow[column] = row[column];
        });
        results.push(selectedRow);
        console.log("Data parsing complete.")
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Combine the two functions above to get the weather and the data
async function getWeatherAndData() {
  await getWeather();
  await delay(1500)
  const data = await getDataFromCSV(csvPath, selectedColumns).then(data => {
    // return the data correctly and readable
    console.log(data);
    return JSON.stringify(data);
  });
  return data;
}

// Delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Filter/format the data
async function formatData(data) {
  data = JSON.parse(data);
  const columns = Object.keys(data[0]);
  const formattedOutput = data.map(entry => {
    return columns
    .filter(column => column !== 'name')
    .map(column => `**${column}**: ${entry[column]}`)
    .join(', ');
  }).join('\n');
  return formattedOutput;
}


// The response of the bot in chat
module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription("Returns the weather!"),
    async execute(interaction, client) {
      // use the getWeather function here
        const message = await interaction.deferReply({ fetchReply: true });
        const data = await getWeatherAndData();
        const formattedData = await formatData(data);
        const newData = JSON.parse(data);
        const loc = newData[0].name;

        const newMessage = `Weather in __*${loc}*__: \n${formattedData}`;
        await interaction.editReply(newMessage);
        console.log(`Command "${this.data.name}" has been executed by ${interaction.user.username} in #${interaction.channel.name} on ${interaction.guild.name}🎉`);
    }
}