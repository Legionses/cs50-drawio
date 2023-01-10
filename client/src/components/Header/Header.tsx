import React from 'react'
import './styles.css'

const Header = ({ users = [] }) => {
    return (
        <header className="App-header">
            <div className="users">
                {users.map(({ userId, color }) => {
                    return (
                        <div
                            key={userId}
                            className="users--item"
                            style={{ borderColor: color }}
                        />
                    )
                })}
            </div>
        </header>
    )
}

export default Header
