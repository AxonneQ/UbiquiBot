// references
const auth = require('./auth.json');
var Discord = require('discord.js');
var Jokes = require('./modules/jokes.js');

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token)
        .then(console.log("Logged in."))
        .catch(console.error);
bot.on('ready', () => {
        console.log("Connected.\n");
});

bot.on('message', (message) => {
        
        //Get the server from which the message was sent.
        let serverID = message.guild.id;
        
        console.log(serverID);

        var text = message.content;
        var channel = message.channel;



        if (text.substring(0, 1) == '!') {                      // If the user input start with '!'
                var args = text.substring(1).split(' '); // extract commands and arguments
                var command = args[0];                        // first argument is the command
                args = args.slice(1);                              // command gets deleted from arguments
                
                switch (command) {
                        case 'joke':
                                Jokes.randomizeJoke(channel, args);
                                break;
                        
                        
                        default:
                }
        }
});

