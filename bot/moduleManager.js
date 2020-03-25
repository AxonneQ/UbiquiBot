module.exports = {
    moduleManager,
};
var moduleList = require('./modules.json');

var fileManager = require('./includes/fileManager');
var help = require('./modules/help');

function moduleManager(channel, args) {
    switch (args[0]) {
        case 'add':
            addModule(channel, args)
                .then(() => {
                    channel.send(`${args[1]} added! Type \`!u module list\` to see active/inactive modules.`);
                })
                .catch((err) => {
                    channel.send(`${err}`);
                });
            break;

        case '':
            channel.send(help);
            break;
    }
}

//edit
function addModule(channel, args) {
    new Promise((res, err) => {
        fileManager.editClientModules(channel.guild.id, 'add', args[1]);
    });
}
