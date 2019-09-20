module.exports = {
        manual
}

function manual(channel, args) {
        switch(args){
                default:
                        channel.send(help);
        }
}

var general =
`***General***
◈   !u help
◈   !u joke   \`misc\` | \`prog\` | \`chuck \`| \`dark\`•
◈   !u stats   \`server\` | \`top\` | \`<username>\` |  \`me\`
◈   !u settings   \`dark_jokes <value>\` (Admin only)`;

var help = 
`**Command List:**
${general}

 • must be enabled in settings by server admin.
 ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Visit https://www.github.com/AxonneQ/UbiquiBot/ to view the source code and documentation.`;



