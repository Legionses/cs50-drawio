const path = require('path')
const express = require('express')
const http = require('http')
const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const { SOCKET_ACTIONS } = require('./utils/constants.ts')
const { isJsonString } = require('./utils/data.ts')

const PORT = process.env.PORT || 3001

const app = express()

const server = http.createServer(app)

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' })
})

const wsServer = new ws.Server({ server })

const clients = {}
const lines = []

const handleActionMessages = (userId, message) => {
    const { type, data } = message

    console.log('message:', type)
    switch (type) {
        case SOCKET_ACTIONS.SAVE_LINE: {
            console.log('clients:', Object.keys(clients))
            if (data.line) lines.push(data.line)
            // @ts-ignore
            Object.entries(clients).forEach(([id, { connection }]) => {
                if (id !== userId) {
                    // @ts-ignore
                    connection.send(
                        JSON.stringify({
                            userId,
                            type,
                            data,
                        })
                    )
                }
            })
            break
        }
    }
}
wsServer.on('connection', (connection) => {
    const userId = uuidv4()
    clients[userId] = { connection, color: 'rgba(14, 255, 255, 1)' }
    console.log('CONNECTED:', userId)

    connection.isAlive = true
    connection.on('pong', () => {
        connection.isAlive = true
    })

    connection.on('close', () => {
        console.log('CONNECTION CLOSED:', userId)
        delete clients[userId]
    })
    //connection is up, let's add a simple simple event
    connection.on('message', (message) => {
        //log the received message and send it back to the client
        if (isJsonString(message)) {
            // console.log('received: %s', message)
            handleActionMessages(userId, JSON.parse(message))
        } else {
        }
    })

    //send immediately a starting data
    connection.send(
        JSON.stringify({
            type: 'INITIALISE',
            data: {
                userId,
                users: Object.entries(clients).map(
                    // @ts-ignore
                    ([userId, { connection, ...client }]) => ({
                        userId,
                        ...client,
                    })
                ),
                canvas: lines,
            },
        })
    )
})

setInterval(() => {
    wsServer.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate()

        ws.isAlive = false
        ws.ping()
    })
}, 10000)

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
