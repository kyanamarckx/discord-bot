// Imports
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const csv = require('csv-parser');
import("node-fetch");

// Variables
const csvPath = 'C:\\Users\\kyana\\OneDrive - Hogeschool Gent\\Documenten\\GitHub\\weather\\data\\weather.csv';
let selectedColumns = ['name', 'datetime', 'tempmax', 'uvindex', 'icon'];


// Functions
// Fetch the weather from the API and save it to a CSV file
async function getWeather(location, forecast) {
  if (forecast === '24-hour') {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next24hours?unitGroup=metric&include=hours&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv`)
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
  } else if (forecast === '15-day') {
      fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?unitGroup=metric&include=days&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv`)
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
    } else if (forecast === 'current') {
      fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next24hours?unitGroup=metric&include=current&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv`)
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
}

// Get the data from the CSV file
async function getDataFromCSV(csvFilePath, columns, forecast) {
  if (forecast === 'current') {
    columns = ['name', 'datetime', 'temp', 'uvindex', 'icon'];
  } else if (forecast === '24-hour') {
    columns = ['name', 'datetime', 'temp', 'conditions'];
  } else {
    columns
  }

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
async function getWeatherAndData(location, forecast) {
  await getWeather(location, forecast);
  await delay(1500)
  const data = await getDataFromCSV(csvPath, selectedColumns, forecast).then(data => {
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
async function formatData(data, forecast) {
  data = JSON.parse(data);
  const columns = Object.keys(data[0]);
  const dateColumn = 'datetime';
  const dateFormatNormal = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const dateFormatHour = { hour: 'numeric', minute: 'numeric' };

  let formattedOutput = data.map(entry => {
    const formattedEntry = {};
    columns
      .filter(column => column !== 'name')
      .forEach(column => {
        formattedEntry[column] = entry[column];
      });
    return formattedEntry;
  });

  if (forecast === '24-hour') {
    const currentTime = new Date();
    const next24hours = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

    formattedOutput = formattedOutput.filter(entry => {
      const entryDateTime = new Date(entry.datetime);
      return entryDateTime >= currentTime && entryDateTime <= next24hours;
    });
  }

  let i = 1;
  formattedOutput = formattedOutput.map((entry) => {
    const formattedEntry = Object.entries(entry).map(([key, value]) => {
      if (key === dateColumn) {
        const date = new Date(value);
        if (forecast === '24-hour') {
          // only show only the hour if the forecast is for the next 24 hours
          return `*${date.toLocaleTimeString('en-US', dateFormatHour)}*`;
        } else {
          return `*${date.toLocaleDateString('en-US', dateFormatNormal)}*`;
        }
      } else if (key === 'icon') {
        if (typeof value === 'string') {
          return `**${key}**: ${value.split('-').join(' ')}`;
        }
      }
      return `**${key}**: ${value}`;
    });

    formattedEntry.unshift(`**${i++}.** ${formattedEntry.shift()}`);
    return formattedEntry.join(', ');
  }).join('\n');
  return formattedOutput;
}



// The response of the bot in chat
module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription("Returns the weather!")
        .addStringOption(option => option.setName('location').setDescription('The location you want to know the weather of').setRequired(true))
        .addStringOption(option => option.setName('forecast').setDescription('Which kind of forecast would you like?').setRequired(true).addChoices({name: 'Next 15 days', value: '15-day'}, {name: 'Next 24 hours', value: '24-hour'}, {name: 'Current weather', value: 'current'})),
    async execute(interaction) {
      // use the getWeather function here
        await interaction.deferReply({ fetchReply: true });
        const location = interaction.options.getString('location');
        const forecast = interaction.options.getString('forecast');
        const data = await getWeatherAndData(location, forecast);
        const formattedData = await formatData(data, forecast);
        const newData = JSON.parse(data);
        let loc = newData[0].name;
        loc = loc.toUpperCase();

        const newMessage = `Weather in ***${loc}***: \n${formattedData}`;
        await interaction.editReply(newMessage);
        console.log(`Command "${this.data.name}" has been executed by ${interaction.user.username} in #${interaction.channel.name} on ${interaction.guild.name}🎉`);
    }
}