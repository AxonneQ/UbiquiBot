var FileSystem = require('fs');

var clientsFile = './clients/clients.json';

module.exports = {

         //Load Client data and settings (Servers running the bot) from file
         loadClients: function() {
                FileSystem.readFile(clientsFile, 'utf-8', function (err, content) {
                        if (err) throw err;

                        var loadedJSON = JSON.parse(content);
                        console.log(loadedJSON);

                });
        },

        saveClients: function(){
                FileSystem.writeFile(clientsFile, 'w', function(err){
                        //dump clientList in a file as string
                });
        },

        addClient: function(server_id) {
                this.clientList.push(server_id)
                //createFile(server_id.json)
        },

        editClientSettings: function(server_id, property, value) {
                //load the client's file, replace value (for example setting toggle)
        },

        updateClientData: function(update) {
                //load the client's file, update whatever values according to the parameter
        }
}









