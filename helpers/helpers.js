const bcrypt = require("bcrypt")

async function hashPassword(password){
    return await bcrypt.hash(password, 10)
}

async function checkPassword(userEnteredPw, hashedPw){
    let bool = await bcrypt.compare(userEnteredPw, hashedPw)
    console.log(bool)
    return bool;
}

module.exports = { hashPassword, checkPassword }