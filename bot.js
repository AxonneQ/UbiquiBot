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


bot.on('message', message => {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        var text = message.content;
        var channel = message.channel;
        if (text.substring(0, 1) == '!') {
                var args = text.substring(1).split(' ');
                var cmd = args[0];

                args = args.splice(1);
                switch (cmd) {
                        // !joke
                        case 'joke':
                                console.log(cmd + " " + args);
                                switch(args[0]) {
                                        case 'dark':
                                                Jokes.getDarkJoke(channel);
                                                break;

                                        default: 
                                                Jokes.randomizeJoke(channel);
                                }
                                break;
                    
                                
                }
        }
});

