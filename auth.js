const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("./model/User.js");

const { checkPassword } = require("./helpers/helpers.js")

const customFields = {
    userNameField: "email",
    passwordField: "password"
}


const verifyCallback = (email, password, done) => {
    User.findOne({ email: email}).then((user) => {
        if(!user){
            return done(null, false)
        }
        const isValid = checkPassword(password, user.password)
        if(isValid){
            done(null, user)
        } else {
            done(null, false)
        }
    }).catch((err) => {
        console.log(err)
        done(err)
    })
}

const strategy = new Strategy(customFields, verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    User.findByID(userId).then((user) => {
        done(null, user)
    })
    .catch((err) => {
        console.log(err)
        done(err)
    })
})