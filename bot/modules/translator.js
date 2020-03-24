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
            let to;
            let messages = [];
            const translatedMessages = [];

            await channel.fetchMessages({ limit: numberOfMsgs })
                .then(msg => msg.filter(m => messages.push({ author: m.member.nickname, content: m.content })))
                .catch(err => { throw `Unexpected termination in fetchMessages() function. \nError: ${err}`; });

            messages = messages.pop();

            if (args[1]) {
                to = args[2];
            } else {
                to = 'eng';
            }

            for(let msg of messages) {
                console.log(msg);
                await translate(msg[1][0], to)
                    .then(output => {
                        translatedMessages.push({author: msg[0], content: output});
                        console.log(output);
                    })
                    .catch(err => { throw `Unexpected termination in translateMessage() function. \nError: ${err}`; });
            }

            console.log(translatedMessages);
        }
    }
}

function detectLanguage(text) {
    return franc(text);
}

async function translate(text, _to) {
    await translator(text, { to: _to })
        .then(output => {
            return output;
        })
        .catch(err => { throw `Unexpected termination in translate() function. \nError: ${err}`});
}