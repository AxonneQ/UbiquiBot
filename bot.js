/*jshint esversion: 6 */ 

//import bot authentication token and discord.js functionality
const auth = require('./auth.json');
var Discord = require('discord.js');

//import bot modules
var Clients = require('./modules/servers');
var Jokes = require('./modules/jokes');
var Stats = require('./modules/stats');
var Help = require('./modules/help');

// Initialize Discord Bot
global.bot = new Discord.Client();

// Log the bot into discord servers.
bot.login(auth.token)
        .then(console.log("Logged in."))
        .catch(console.error);
bot.on('ready', () => {
        console.log("Connected.\n");
        Clients.saveClients(bot.guilds);
});

// Update server list upon joining/leaving the server
bot.on('guildCreate', guild => {
        Clients.saveClients(bot.guilds);
        console.log(`${bot.user.username} was added on ${guild.name} (ID: ${guild.id}).`);
        let channel = getTextChannel(guild);
        if (channel !== undefined) {
                channel.send(`Hi! Thanks for using ${bot.user.username}. Setting up...`);
                Stats.count(channel, ['all']).then(function () {
                        channel.send('Setup done. Type \`!u help\` for list of commands.');
                });


        }
});

bot.on('guildDelete', guild => {
        Clients.saveClients(bot.guilds);
        console.log(`${bot.user.username} was removed from ${guild.name} (ID: ${guild.id}).`);
});


// Listen to messages
bot.on('message', message => {

        /*
        // Prepare an update to be sent
        let update = {
                server: message.guild,
                channel: message.channel,
                author: message.author
                //... more info if needed
        }
        
        Clients.updateClientData(update);
        */

        if (message.content.substring(0, 2) == '!u') {                      // If the user input start with '!u'
                var args = message.content.substring(3).split(' '); // extract commands and arguments
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
                                Help.manual(message.channel, args);
                                break;
                        case 'count':
                                Stats.count(message.channel, args);
                                break;
                        case '':
                                //If no command, respond to the user with a joke.
                                message.channel.send("no u.");
                                break;
                        default:
                                //Don't send any message if unknown argument to prevent chat spam.
                }
        }
});

function getTextChannel(guild) {
        let channels = [];

        if (guild.systemChannel === null) {
                for (var k of guild.channels.keys()) {
                        var c = guild.channels.get(k);

                        if (c.type == 'text' &&
                                c.memberPermissions(bot.user).has('VIEW_CHANNEL') &&
                                c.memberPermissions(bot.user).has('SEND_MESSAGES')) {
                                if (c.name == 'general' || c.name == 'welcome') {
                                        return c;
                                } else {
                                        channels.push(c);
                                }
                        }
                }
        } else {
                return guild.systemChannel;
        }
        return channels[0];
}