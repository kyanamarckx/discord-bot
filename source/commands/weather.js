const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const csv = require('csv-parser');
import("node-fetch");

// function selectColumns(csvFilePath, columns) {
//   const selectedData = [];

//   fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const selectedRow = {};
//       columns.forEach(column => {
//         selectedRow[column] = row[column];
//       });
//       selectedData.push(selectedRow);
//     })
//     .on('end', () => {
//       console.log('Data parsing complete');
//       // console.log(selectedData);
//     });

//   return selectedData;
// }


const csvPath = 'C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\weather\\data\\weather.csv';
const selectedColumns = ['name', 'datetime', 'temp'];


async function getWeather() {
  fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Aalst?unitGroup=metric&include=days&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv')
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

async function getWeatherAndData() {
  await getWeather();
  await delay(2500)
  const data = await getDataFromCSV(csvPath, selectedColumns).then(data => {
    // return the data correctly and readable
    console.log(data);
    return JSON.stringify(data);
  });
  return data;
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription("Returns the weather!"),
    async execute(interaction, client) {
      // use the getWeather function here
        const message = await interaction.deferReply({ fetchReply: true });
        const data = await getWeatherAndData();

        const newMessage = `Weather for **${data.name}**: \n${data}`;
        await interaction.editReply(newMessage);
        console.log(`Command "${this.data.name}" has been executed by ${interaction.user.username} in #${interaction.channel.name} on ${interaction.guild.name}🎉`);
    }
}