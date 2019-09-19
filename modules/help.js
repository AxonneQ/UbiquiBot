module.exports = {
        manual
}

function manual(channel, args) {
        switch(args){
                default:
                        channel.send(help);
        }
}

var help = 
`**Command List:**
!u joke ( \`misc\` | \`prog\` | \`chuck \`| \`dark\`\* )
!u stats ( \`server\` | \`top\` | \`<username>\` )
Visit https://www.github.com/AxonneQ/UbiquiBot/ to view the source code and documentation.`;