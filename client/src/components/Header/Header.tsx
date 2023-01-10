import React, { useEffect, useRef } from 'react'
import './styles.css'

const Header = ({
    users = [],
    color = '',
    sendMessage = (message: string) => {},
    changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {},
}) => {
    const colorRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (colorRef.current) colorRef.current.value = color
    }, [color])

    const resetCanvas = () => {
        sendMessage(
            JSON.stringify({
                type: 'RESET_CANVAS',
            })
        )
    }

    return (
        <header className="App-header">
            <div className="instruments">
                <button className="resetBtn" onClick={resetCanvas} />
                <input ref={colorRef} type="color" onBlur={changeColor} />
            </div>
            <div className="users">
                {users.map(({ userId, color, username }) => {
                    return (
                        <div
                            key={userId}
                            className="users--item tooltip"
                            style={{ borderColor: color }}
                        >
                            <div className="tooltiptext">{username}</div>
                        </div>
                    )
                })}
            </div>
        </header>
    )
}

export default Header
