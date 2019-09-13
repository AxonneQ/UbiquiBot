module.exports = {
        count,
        countMessages,
        countChannelMessages
}

// Function to redirect to appropriate function depending on arguments
function count(channel, args) {
        switch (args[0]) {
                case 'all':
                        channel.send('Counting messages in all text channels...');
                        countMessages(channel.guild).then(results => {
                                var output = `Found **${results.messageCount}** messages in **${results.channelCount}** channels:\n`;
                                for(var i = 0; i < results.channelCount; i++) {
                                        output += `> **${results.messages[i].channel.toString()}**: ${results.messages[i].messages.length}\n`;
                                }
                                channel.send(output);
                        });
                        break;
                case 'here':
                        channel.send(`Counting messages in ${channel.toString()}...`);
                        countChannelMessages(channel).then(messages => {
                                channel.send(`Found **${messages.length}** messages in ${channel.toString()}.\n
                                `);
                        })
                        break;
                default:
                        channel.send('Invalid arguments. Possible arguments: !count **all**  |  **here**.');
        }
}

// Function to count all messages on the server
async function countMessages(client) {
        var textChannels = [];
        var res;

        // Get only text channels
        client.channels.forEach(channel => {
                if (channel.type == 'text') {
                        textChannels.push(channel);
                }
        });

        await msgFromChannels(textChannels).then(results => {
                res = results;
        });
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
                const messages = await channel.fetchMessages(msgOptions);
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

        for(var i = 0; i < textChannels.length; i++){
                await countChannelMessages(textChannels[i]).then(messages => {
                        allMessages.push({messages: messages, channel: textChannels[i]});
                        totalCount += messages.length;
                })
        }
        return {channelCount: textChannels.length, messages: allMessages, messageCount: totalCount};
}

//function for server stats: Number of servers served, Age of the bot and more.

//function for user stats: messages sent, current experience points, current level and progress and more...

//function for leaderboards: showing the top 10 users