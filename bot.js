//import bot authentication token and discord.js functionality
const auth = require('./auth.json');
var Discord = require('discord.js');

//import bot modules
var Clients = require('./clients/servers');
var Jokes = require('./modules/jokes');
var Stats = require('./modules/stats');

// Initialize Discord Bot
var bot = new Discord.Client();


bot.login(auth.token)
        .then(console.log("Logged in."))
        .catch(console.error);
bot.on('ready', () => {
        console.log("Connected.\n");
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
        
        console.log(`${server.name}/${channel.name} - ${user.username}: ${text}`);

        if (text.substring(0, 1) == '!') {                      // If the user input start with '!'
                var args = text.substring(1).split(' '); // extract commands and arguments
                var command = args[0];                        // first argument is the command
                args = args.slice(1);                              // command gets deleted from arguments
                
                switch (command) {
                        case 'joke':
                                Jokes.randomizeJoke(message.channel, args);
                                break;
                        case 'stats':

                        
                        
                        default:
                }
        }
});

