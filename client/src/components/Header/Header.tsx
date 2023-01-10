import React from 'react'
import './styles.css'

const Header = ({ users = [], sendMessage = (message: string) => {} }) => {
    const resetCanvas = () => {
        sendMessage(
            JSON.stringify({
                type: 'RESET_CANVAS',
            })
        )
    }

    return (
        <header className="App-header">
            <div>
                <button className="resetBtn" onClick={resetCanvas} />
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
