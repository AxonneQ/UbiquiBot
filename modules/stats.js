module.exports = {
        count,
        countMessages,
        countChannelMessages
}

// Function to redirect to appropriate function depending on arguments
function count(channel, args) {
        switch (args[0]) {
                case 'all':
                        channel.send('Counting messages in all text channels...\n*(It might take a couple of minutes depending on message count)*');
                        countMessages(channel.guild).then(results => {
                                var output = `Found **${results.messageCount}** messages in **${results.channelCount}** channels:\n`;
                                for (var i = 0; i < results.channelCount; i++) {
                                        output += `> ${results.messages[i].channel.toString()}: ${results.messages[i].messages.length}\n`;
                                }
                                for (var i = 0; i < results.noPerm.length; i++) {
                                        output += `> ${results.noPerm[i].toString()}:  No \`VIEW_CHANNEL\`  or  \`READ_MESSAGE_HISTORY\`  permission.\n`;
                                }
                                channel.send(output);
                        }).catch(console.error);
                        break;
                case 'here':
                        channel.send(`Counting messages in ${channel.toString()}...\n*(It might take a couple of minutes depending on message count)*`);
                        countChannelMessages(channel).then(messages => {
                                channel.send(`Found **${messages.length}** messages in ${channel.toString()}.`);
                        })
                        break;
                default:
                        channel.send('Invalid arguments. Possible arguments: !count **all**  |  **here**.');
        }
}

// Function to count all messages on the server
async function countMessages(client) {
        var textChannels = [];
        var noPermChannels = [];
        var res;
        // Get only text channels
        client.channels.forEach(channel => {
                if (channel.type == 'text') {
                        if (channel.memberPermissions(bot.user).has('VIEW_CHANNEL') &&
                                channel.memberPermissions(bot.user).has('READ_MESSAGE_HISTORY')) {
                                textChannels.push(channel);
                        } else {
                                noPermChannels.push(channel);
                        }
                }
        });

        await msgFromChannels(textChannels).then(results => {
                res = results;
        });

        res.noPerm = noPermChannels;

        return res;
}

// Function to count all messages in a specific channel
async function countChannelMessages(channel) {
        let lastMessageID;
        let msgOptions = { limit: 100 };

        let allMessages = [];

        while (true) {
                if (lastMessageID) {
                        msgOptions.before = lastMessageID;
                }
                const messages = await channel.fetchMessages(msgOptions)
                .catch(err => { throw `Unexpected termination in fetchMessages() function. \nError: ${err}` });
                lastMessageID = messages.last().id;
                allMessages.push(...messages.array());

                if (messages.size != 100) {
                        break;
                }
        }

        return allMessages;
}

// Function to fetchMessages from array of channels
async function msgFromChannels(textChannels) {
        let allMessages = [];
        let totalCount = 0;

        for (var i = 0; i < textChannels.length; i++) {
                await countChannelMessages(textChannels[i]).then(messages => {
                        allMessages.push({ messages: messages, channel: textChannels[i] });
                        totalCount += messages.length;
                })
        }
        return { channelCount: textChannels.length, messages: allMessages, messageCount: totalCount };
}

//function for server stats: Number of servers served, Age of the bot and more.

//function for user stats: messages sent, current experience points, current level and progress and more...

//function for leaderboards: showing the top 10 users