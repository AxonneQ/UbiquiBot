module.exports = {
    translateMessage,
};

const translator = require('../services/translateService');

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
            let targetLang = null;
            let messages = [];
            const translatedMessages = [];

            await channel
                .fetchMessages({ limit: numberOfMsgs, before: message.id })
                .then((msg) =>
                    msg.filter((m) => {
                        messages.push({ author: m.member.nickname || m.author.username, content: m.content });
                    })
                )
                .catch((err) => {
                    throw `Unexpected termination in fetchMessages() function. \nError: ${err}`;
                });

            if (args[1]) {
                if (translator.isLangSupported(args[1])) {
                    targetLang = translator.getCodeFromLang(args[1]);
                } else {
                    channel.send(
                        `\`${args[1]}\` is not a valid language or language code. Type \`!u translate list\` to see a list of supported languages.`
                    );
                    return;
                }
            } else {
                targetLang = 'en'; // TODO default language from server settings
            }

            for (let m in messages) {
                const msg = messages[m].content;
                let output = await translator.translate(msg, targetLang);
                translatedMessages.push({ author: messages[m].author, content: output.extract.translation });
                console.log(`Translation:`, output.extract.translation);
            }

            translatedMessages.reverse();

            let output = `Translation of last **${numberOfMsgs}** message(s) to **${translator.getLangFromCode(targetLang)}**:`;
            for (const msg of translatedMessages) {
                output += `\n**${msg.author}**: ${msg.content}`;
            }

            channel.send(output);
        }
    } else if (args[0] === 'list') {
        let output = 'Languages and codes:\nhttps://github.com/AxonneQ/UbiquiBot/wiki/Translator';
        channel.send(output);
    }
}
