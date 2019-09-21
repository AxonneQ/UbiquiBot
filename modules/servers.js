var FileSystem = require('fs');
var clientsDataTemplate = require('./data_template');

var clientsDir = './clients/';
var clientsDataDir = './clients/data/';
var clientsFile = './clients/client_list.json';

module.exports = {
        saveClients,
        manageClientFiles,
        editClientSettings,
        updateClientData
};

//dump all current servers using bot into a JSON file
function saveClients(serverList) {
        var idList = [];
        serverList.forEach(function (server) {
                idList.push(server.id);
        });

        // check for ./clients/ dir
        FileSystem.readdir(clientsDir, (err, _files) => {
                if (err) {
                        // Create clients directory if non-existant.
                        if (err.errno === -4058 || err.errno === -2) {
                                FileSystem.mkdir(clientsDir, { recursive: true }, err => {
                                        if (err) throw err;
                                });
                        } else throw `${err} CODE: ${err.errno}`;
                }
                FileSystem.writeFile(clientsFile, JSON.stringify(idList), err => {
                        if (err) throw `${err} CODE: ${err.errno}`;

                        manageClientFiles(idList);
                });
        });
}

function manageClientFiles(idList) {
        FileSystem.readdir(clientsDataDir, (err, _files) => {
                if (err) {
                        // Create clients/data/ directory if non-existant.
                        if (err.errno === -4058 || err.errno === -2) {
                                FileSystem.mkdir(clientsDataDir, { recursive: true }, err => {
                                        if (err) throw err;
                                });
                        } else throw err;
                }

                var files = Array();
                if (_files !== undefined) {
                        // store results in a new variable 
                        files = Array.from(_files);
                }

                // If current client doesn't have a file, create it.
                idList.forEach(id => {
                        if (id !== undefined) {
                                if (!files.includes(id)) {
                                        console.log("Creating directory " + id);
                                        FileSystem.mkdir(clientsDataDir + id, { recursive: true }, err => {
                                                if (err) throw err;
                                                // Create settings file.
                                                FileSystem.writeFile(clientsDataDir + id + '/settings.json', JSON.stringify(clientsDataTemplate.settings(), null, 8), err => {
                                                        if (err) throw err;
                                                });
                                                // Create client's members data directory.
                                                FileSystem.mkdir(clientsDataDir + id + '/users', { recursive: true }, err => {
                                                        if (err) throw err;
                                                });
                                        });
                                }
                        }
                });

                // If there exists a file but doesn't belong to any current client, delete it.
                files.forEach(file_id => {
                        if (file_id !== undefined) {
                                if (!idList.includes(file_id)) {
                                        console.log("Removing directory " + file_id);
                                        FileSystem.rmdir(clientsDataDir + file_id, { recursive: true }, err => {
                                                if (err) throw err;
                                        });
                                }
                        }
                });
        });
}

function editClientSettings(server_id, property, value) {
        //load the client's file, replace value (for example setting toggle)
}

function updateClientData(update) {
        //load the client's file, update whatever values according to the parameter
        //console.log(update);
}

function deleteDirectory(path) {

}










