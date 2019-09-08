//import bot authentication token and discord.js functionality
const auth = require('./auth.json');
var Discord = require('discord.js');

//import bot modules
var Clients = require('./clients/servers');
var Jokes = require('./modules/jokes');
var Stats = require('./modules/stats');

// Initialize Discord Bot
var bot = new Discord.Client();

// Log the bot into discord servers.
bot.login(auth.token)
        .then(console.log("Logged in."))
        .catch(console.error);
bot.on('ready', () => {
        console.log("Connected.\n");
});

// Update server list upon joining/leaving the server
bot.on('guildCreate', guild => {
        Clients.saveClients(bot.guilds);
        console.log(`UbiquiBot was added on ${guild.name} (ID: ${guild.id}).`);
});
bot.on('guildDelete', guild => {
        Clients.saveClients(bot.guilds);
        console.log(`UbiquiBot was removed from ${guild.name} (ID: ${guild.id}).`);
});

// Listen to messages
bot.on('message', message => {

        // Prepare an update to be sent
        let update = {
                server: message.guild,
                channel: message.channel,
                author: message.author
                //... more info if needed
        }

        Clients.updateClientData(update);


        if (message.content.substring(0, 1) == '!') {                      // If the user input start with '!'
                var args = message.content.substring(1).split(' '); // extract commands and arguments
                var command = args[0];                        // first argument is the command
                args = args.slice(1);                              // command gets deleted from arguments

                switch (command) {
                        case 'joke':
                                Jokes.randomizeJoke(message.channel, args);
                                break;
                        case 'stats':
                                // TODO: display statistics (messages sent, user leaderboards etc...)
                                break;
                        case 'help':
                                // TODO: a help message listing all the functionality
                                break;


                        default:
                }
        }
});

