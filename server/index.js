var path = require('path');
var express = require('express');
var http = require('http');
var ws = require('ws');
var uuidv4 = require('uuid').v4;
var SOCKET_ACTIONS = require('./utils/constants.ts').SOCKET_ACTIONS;
var isJsonString = require('./utils/data.ts').isJsonString;
var PORT = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.get('/api', function (req, res) {
    res.json({ message: 'Hello from server!' });
});
var wsServer = new ws.Server({ server: server });
var clients = {};
var lines = [];
var handleActionMessages = function (userId, message) {
    var type = message.type, data = message.data;
    console.log('message:', type);
    switch (type) {
        case SOCKET_ACTIONS.SAVE_LINE: {
            console.log('clients:', Object.keys(clients));
            if (data.line)
                lines.push(data.line);
            Object.entries(clients).forEach(function (_a) {
                var id = _a[0], connection = _a[1].connection;
                if (id !== userId) {
                    // @ts-ignore
                    connection.send(JSON.stringify({
                        userId: userId,
                        type: type,
                        data: data
                    }));
                }
            });
            break;
        }
    }
};
wsServer.on('connection', function (connection) {
    var userId = uuidv4();
    clients[userId] = { connection: connection, color: 'rgba(14, 255, 255, 1)' };
    //connection is up, let's add a simple simple event
    connection.on('message', function (message) {
        //log the received message and send it back to the client
        if (isJsonString(message)) {
            // console.log('received: %s', message)
            handleActionMessages(userId, JSON.parse(message));
        }
        else {
        }
    });
    //send immediatly a feedback to the incoming connection
    connection.send(JSON.stringify({
        type: 'INITIALISE',
        data: {
            userId: userId,
            users: clients,
            canvas: lines
        }
    }));
});
server.listen(PORT, function () {
    console.log("Server listening on ".concat(PORT));
});
