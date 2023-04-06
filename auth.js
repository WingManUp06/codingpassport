const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./model/User.js");

const { checkPassword } = require("./helpers/helpers.js")
const customFields = {
    userNameField: "email"
}


const verifyCallback = (email, password, done) => {
    console.log(email)
    console.log(password)
    User.findOne({ email: email}).then((user) => {
        if(!user){
            return done(null, false)
        }
        const isValid = checkPassword(password, user.passwordHash)
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

// console.log(verifyCallback)

// const strategy = new LocalStrategy(customFields, verifyCallback)

// console.log(strategy)

passport.use("local", new LocalStrategy({
    usernameField: "email"
}, (email, password, done) => {
    // console.log(email)
    // console.log(password)
    User.findOne({ email: email}).then(async (user) => {
        if(!user){
            return done(null, false)
        }
        // console.log(password)
        // console.log(user.password)
        const isValid = await checkPassword(password, user.password)
        // console.log(typeof(isValid))
        if(isValid){
            done(null, user)
        } else {
            done(null, false)
        }
    }).catch((err) => {
        console.log(err)
        done(err)
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    User.findById(userId).then((user) => {
        done(null, user)
    })
    .catch((err) => {
        console.log(err)
        done(err)
    })
})