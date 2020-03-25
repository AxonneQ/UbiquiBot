module.exports = {
    help,
};

function help(channel, args) {
    switch (args) {
        default:
            channel.send(commandList);
    }
}

var general = `***General***
◈   !u help
◈   !u joke   \`misc\` | \`prog\` | \`chuck \`| \`dark\`•
◈   !u stats   \`server\` | \`top\` | \`<username>\` |  \`me\`
◈   !u settings   \`dark_jokes <value>\` (Admin only)`;

var commandList = `**Command List:**
${general}

 • must be enabled in settings by server admin.
 ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Visit https://www.github.com/AxonneQ/UbiquiBot/ to view the source code and documentation.`;
