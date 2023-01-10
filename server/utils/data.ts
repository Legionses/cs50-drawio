const { NAMES } = require('./constants.ts')
const isJsonString = (str) => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

const getName = (users) => {
    const checkName = (name) => {
        return users.find((user) => user.username === name)
    }

    if (!users.length) return NAMES[0]

    let name = ''

    for (let i = 0; i <= NAMES.length - 1; i++) {
        name = NAMES[i]
        const exist = checkName(name)
        if (!exist) {
            break
        }
    }
    return name
}

module.exports = { isJsonString, getName }
