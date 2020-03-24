//import bot authentication token and discord.js functionality
const auth = require('./auth.json');
const Discord = require('discord.js');

//import bot modules
const ModuleList = require('./bot/modules.json');

const Modules = require('./bot/moduleManager');
const Files = require('./bot/includes/fileManager');
const Jokes = require('./bot/modules/jokes');
const Messages = require('./bot/includes/messageManager');
const Help = require('./bot/modules/help');
const Translator = require('./bot/modules/translator');

// Initialize Discord Bot
global.bot = new Discord.Client();

// Log the bot into discord servers.
bot.login(auth.token2)
    .then(console.log("Logged in."))
    .catch(console.error);
bot.on('ready', () => {
    console.log("Connected.\n");
    Files.saveClients(bot.guilds);
});

// Update server list upon joining/leaving the server
bot.on('guildCreate', guild => {
    if (guild.available) {
        Files.saveClients(bot.guilds);
        console.log(`${bot.user.username} was added on ${guild.name} (ID: ${guild.id}).`);
        let channel = getTextChannel(guild);
        if (channel !== undefined) {
            let m = '';
            ModuleList.modules.forEach(element => {
                m += `   ◈   \`${element[0]}\` - ${element[1]}\n`;
            });
            channel.send(`Hi! Thanks for using ${bot.user.username}. \nCustomise it by adding any of the following modules by using \`!u module add <module name>\`.\n${m}`);
            /*Messages.count(channel, ['all']).then(function () {
                    channel.send('Setup done. Type \`!u help\` for list of commands.');
            });*/
        }
    }
});

bot.on('guildDelete', guild => {
    if (guild.available) {
        Files.saveClients(bot.guilds);
        console.log(`${bot.user.username} was removed from ${guild.name} (ID: ${guild.id}).`);
    }
});


// Listen to messages
bot.on('message', async message => {

    //Debug section

    //End Debug section

    /*
    // Prepare an update to be sent
    let update = {
            server: message.guild,
            channel: message.channel,
            author: message.author
            //... more info if needed
    }
    
    Files.updateClientData(update);
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
            case 'module':
                Modules.moduleManager(message.channel, args);
                break;
            case 'help':
                Help.help(message.channel, args);
                break;
            case 'count':
                Messages.count(message.channel, args);
                break;
            case 'translate':
                Translator.translateMessage(message.channel, args);
                break;
            case '':
                //If no command, respond to the user with a joke.
                message.channel.send("no u.");
                break;
            default:
            //Don't send any message if unknown argument to prevent chat spam.
        }
    // } else {
    //     let lang = franc(message.content, {only: ['eng', 'nno', 'nob', 'pol']})
    //     console.log(lang);
    //     if (lang == 'nob' || lang == 'nno') {
    //         translator.from = 'no';
            
    //         message.channel.send('**Translated from Danish:**');
    //         const text = await translator(message.content, 'eng');
    //         console.log(text);
    //         message.channel.send(text);
            
    //         lang = '';
    //     }
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