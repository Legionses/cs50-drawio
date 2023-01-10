import React, { useEffect, useMemo, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './styles/App.css'
import Canvas from './components/Canvas'
import Header from './components/Header'
import { drawLine, redrawCanvas } from './utils/canvas'
import { SOCKET_ACTIONS } from './utils/constants'

function App() {
    const [users, setUsers] = useState([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3001', {
        onOpen: () => {
            console.log('WebSocket connection established.')
        },
    })

    const user = useMemo(() => {
        if (!users.length) return { color: '' }
        console.log(users)
        return users.find((user: { isMe: boolean }) => user.isMe)
    }, [users])

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

    // @ts-ignore
    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        sendMessage(
            JSON.stringify({
                type: 'USER_UPDATE',
                data: {
                    color: e.target.value,
                },
            })
        )
    }

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
                setUsers(
                    data.users.map((user: { userId: any }) =>
                        user.userId === data.userId
                            ? { ...user, isMe: true }
                            : user
                    )
                )
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
            case 'USER_UPDATE': {
                // @ts-ignore
                setUsers(
                    // @ts-ignore
                    users.map((user: object) =>
                        // @ts-ignore
                        user.userId === userId ? { ...user, ...data } : user
                    )
                )
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
            <Header
                users={users}
                color={user!.color}
                sendMessage={sendMessage}
                changeColor={changeColor}
            />
            <section className="App-body">
                <Canvas
                    saveLine={saveLine}
                    ref={canvasRef}
                    color={user!.color}
                />
            </section>
        </div>
    )
}

export default App
