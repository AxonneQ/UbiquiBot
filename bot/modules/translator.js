module.exports = {
    translateMessage,
};

const auth = require('../../auth.json');
const langs = require('../includes/supportedLanguages.json');
const langCodeMappings = require('../includes/countryCodeMapping.json');

//import external libraries
const translator = require('translate');
const franc = require('franc');

//Initialise
translator.engine = 'yandex';
translator.key = auth.translateApiKey;
const supportedLangs = new Map(Object.entries(langs));
const langCodeMap = new Map(Object.entries(langCodeMappings));

async function translateMessage(message, args) {
    const channel = message.channel;

    if (!isNaN(parseInt(args[0]))) {
        const numberOfMsgs = parseInt(args[0]);
        if (numberOfMsgs > 10) {
            channel.send(`Number cannot exceed 10. Entered: ${numberOfMsgs}.`);
            return;
        } else if (numberOfMsgs < 1) {
            channel.send(`Number must be greater than 0. Entered: ${numberOfMsgs}.`);
            return;
        } else {
            let from = null;
            let to = null;
            let messages = [];
            const translatedMessages = [];

            await channel
                .fetchMessages({ limit: numberOfMsgs, before: message.id })
                .then((msg) =>
                    msg.filter((m) => {
                        messages.push({ author: m.member.nickname, content: m.content });
                    })
                )
                .catch((err) => {
                    throw `Unexpected termination in fetchMessages() function. \nError: ${err}`;
                });

            if (args[1] && args[2]) {
                if (supportedLangs.has(args[1])) {
                    from = args[1];
                } else {
                    channel.send(
                        `\`${args[1]}\`is not a valid language. Type \`!u translate list\` to see a list of supported languages.`
                    );
                    return;
                }

                if (supportedLangs.has(args[2])) {
                    to = args[2];
                } else {
                    channel.send(
                        `\`${args[2]}\`is not a valid language. Type \`!u translate list\` to see a list of supported languages.`
                    );
                    return;
                }
            }

            if (args[1] && !args[2]) {
                if (supportedLangs.has(args[1])) {
                    to = args[1];
                } else {
                    channel.send(
                        `\`${args[1]}\`is not a valid language. Type \`!u translate list\` to see a list of supported languages.`
                    );
                    return;
                }
            }

            if (!args[1] && !args[2]) {
                to = 'en'; // TODO default language from server settings
            }

            for (let m in messages) {
                const msg = messages[m].content;
                if (from === null) {
                    from = toTwoLetter(detectLanguage(msg));
                    console.log(`Original: ${msg}, ${from}, ${to}`);
                }

                await translate(msg, from, to)
                    .then((output) => {
                        translatedMessages.push({ author: messages[m].author, content: output });
                        console.log(`Translation:`, output);
                        from = null;
                    })
                    .catch((err) => console.log(err));
            }

            translatedMessages.reverse();

            let output = `Translation of last **${numberOfMsgs}** messages to **${supportedLangs.get(to)}**:`;
            for (const msg of translatedMessages) {
                output += `\n**${msg.author}**: ${msg.content}`;
            }

            channel.send(output);
        }
    }
}

function toTwoLetter(threeLetterCode) {
    let output = langCodeMap.get(threeLetterCode);
    return output;
}

function detectLanguage(text) {
    return franc(text, { minLength: 3 });
}

async function translate(text, _from, _to) {
    return await translator(text, { from: _from, to: _to });
}
