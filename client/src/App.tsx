import React, { useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './styles/App.css'
import Canvas from './components/Canvas'
import Header from './components/Header'
import { drawLine, redrawCanvas } from './utils/canvas'
import { SOCKET_ACTIONS } from './utils/constants'

function App() {
    const [users, setUsers] = useState([])
    const [color, setColor] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3001', {
        onOpen: () => {
            console.log('WebSocket connection established.')
        },
    })

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
                const user = data.users.find(
                    (user: { userId: string }) => data.userId === user.userId
                )
                setUsers(data.users)
                setColor(user.color)
                if (canvasRef.current)
                    redrawCanvas(data.canvas, canvasRef.current)
                break
            }
            case 'USER_JOINED': {
                if (data.user) {
                    // @ts-ignore
                    setUsers([...users, data.user])
                }
                break
            }
            case 'USER_LEFT': {
                setUsers(
                    users.filter(
                        (user: { userId: string }) => user.userId !== userId
                    )
                )
                break
            }
            case 'RESET_CANVAS': {
                if (!canvasRef.current) return
                const context = canvasRef.current.getContext('2d')
                context!.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                )

                break
            }
        }
    }

    useEffect(() => {
        if (lastMessage?.data) {
            try {
                const data = JSON.parse(lastMessage.data)
                handleMessages(data)
            } catch (e) {}
        }
    }, [lastMessage])

    return (
        <div className="App">
            <Header users={users} sendMessage={sendMessage} />
            <section className="App-body">
                <Canvas saveLine={saveLine} ref={canvasRef} color={color} />
            </section>
        </div>
    )
}

export default App
