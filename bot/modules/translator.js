module.exports = {
    translateMessage
};

const auth = require('../../auth.json')


//import external libraries
const translator = require('translate');
const franc = require('franc');

//Initialise external libs
translator.engine = 'yandex';
translator.key = auth.translateApiKey;

async function translateMessage(channel, args) {
    if (parseInt(args[0]) !== NaN) {
        const numberOfMsgs = parseInt(args[0]) + 1;
        if (numberOfMsgs > 10) {
            channel.send(`Number cannot exceed 10. Entered: ${numberOfMsgs}.`);
            return;
        } else if (numberOfMsgs < 1) {
            channel.send(`Number must be greater than 0. Entered: ${numberOfMsgs}.`);
            return;
        } else {
            let from;
            let to;
            let messages = [];
            const translatedMessages = [];

            await channel.fetchMessages({ limit: numberOfMsgs })
                .then(msg => msg.filter(m => messages.push({author: m.member.nickname, content: m.content} )))
                .catch(err => { throw `Unexpected termination in fetchMessages() function. \nError: ${err}`; });

            messages = messages.pop();
            console.log(messages);

            if (args[1]) {
                from = args[1];
            }
            if (args[2]) {
                to = args[2];
            } else {
                to = 'eng';
            }

            for(let rawMsg of messages) {
                const msg = rawMsg[1];

                if (!from) { 
                    from = detectLanguage(msg.content) 
                }

                let msgObject = {author: msg.member.nickname, content: msg.content};
                console.log(msgObject);
                console.log(from);
                const translatedMsg = await translate(msgObject.content, from, to);
                
                let tMsgObject = {author: msgObject.author, content: translatedMsg};
                console.log(tMsgObject);

                translatedMessages.push(translatedMsg);
                from = undefined;
            };
        }


    }
}

function detectLanguage(text) {
    return franc(text);
}

async function translate(text, _from, _to) {
    return await translator(text, { from: _from, to: _to });
}