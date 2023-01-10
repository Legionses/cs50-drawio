import React from 'react'
import './styles.css'

const Header = ({ users = [] }) => {
    return (
        <header className="App-header">
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
