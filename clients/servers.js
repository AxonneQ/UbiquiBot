var FileSystem = require('fs');

var clientsFile = './clients/clients.json';

module.exports = {

        //Load Client data and settings (Servers running the bot) from file
        loadClients: function () {
                FileSystem.readFile(clientsFile, 'utf-8', function (err, content) {
                        if (err) throw err;

                        var loadedJSON = JSON.parse(content);
                        console.log(loadedJSON);

                });
        },

        //dump all current servers using bot into a JSON file
        saveClients: function (serverList) {
                var idList = [];
                serverList.forEach(function (server) {
                        idList.push(server.id);
                })

                FileSystem.writeFile(clientsFile, JSON.stringify(idList), function (err) {
                        if (err) throw err;
                });
        },

        addClient: function (server_id) {
                this.clientList.push(server_id)
                //createFile(server_id.json)
        },

        editClientSettings: function (server_id, property, value) {
                //load the client's file, replace value (for example setting toggle)
        },

        updateClientData: function (update) {
                //load the client's file, update whatever values according to the parameter
                //console.log(update);
        }
}









