import React, { useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './styles/App.css'
import Canvas from './components/Canvas'
import Header from './components/Header'
import { drawLine, redrawCanvas } from './utils/canvas'
import { SOCKET_ACTIONS } from './utils/constants'

function App() {
    const [users, setUsers] = useState([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        'ws://localhost:3001',
        {
            onOpen: () => {
                console.log('WebSocket connection established.')
            },
        }
    )

    const saveLine = (line: any) => {
        sendMessage(
            JSON.stringify({
                type: SOCKET_ACTIONS.SAVE_LINE,
                data: {
                    line,
                },
            })
        )
    }

    useEffect(() => {
        // @ts-ignore
        window.send = sendMessage
    }, [sendMessage])

    const handleMessages = (message: { userId: any; type: any; data: any }) => {
        const { userId, type, data } = message

        console.log('message:', type)
        switch (type) {
            case SOCKET_ACTIONS.SAVE_LINE: {
                if (canvasRef.current) {
                    drawLine(data.line, canvasRef.current)
                }
                break
            }
            case 'INITIALISE': {
                console.log(data)
                setUsers(data.users)
                if (canvasRef.current)
                    redrawCanvas(data.canvas, canvasRef.current)
                break
            }
        }
    }

    useEffect(() => {
        if (lastMessage?.data) {
            handleMessages(JSON.parse(lastMessage.data))
        }
    }, [lastMessage])

    return (
        <div className="App">
            <Header users={users} />
            <section className="App-body">
                <Canvas saveLine={saveLine} ref={canvasRef} />
            </section>
        </div>
    )
}

export default App
