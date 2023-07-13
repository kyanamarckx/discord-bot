// Import
const fs = require('fs');

// Create the handleEvents function
module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync('./source/events');
    for (const folder of eventFolders) {
      const eventFiles = fs.readdirSync(`./source/events/${folder}`).filter(file => file.endsWith('.js'));
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once) {
              client.once(event.name, (...args) => event.execute(...args, client));
            } else {
              client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`Loaded event "${event.name}" has passed through the event handler🎈`)
          }
          break;
      
        default:
          break;
      }
    }
  }
}