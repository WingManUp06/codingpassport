const express = require("express")
const app = express()
// calling in everything else
// const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")

const MongoStore = require("connect-mongo")
// const { Strategy } = require("passport-local")

// For the database
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/learningPassport");
const User = require("./model/User.js");

//Helpers
const { hashPassword } = require("./helpers/helpers.js")

// for passport
require("./auth.js")


// Middleware 
app.use(session({
    secret: "thisNeedsToBeChanged",
    resave: false,
    saveUninitialized: false,
    // Look at the "connect-mongo" npm documentation for below
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/learningPassport", collection: 'sessions' }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

app.use(passport.initialize())
app.use(passport.session())

// require('./auth.js')


// For web pages
app.use(express.static("views"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    console.log("get req to /")
})

app.post("/login", passport.authenticate("local", { failureRedirect: "/", successRedirect: "/secretSite"}))

app.post("/signup", async (req, res) => {
    // Check if the email has already been used
    const hashedPassword = await hashPassword(req.body.password)
    console.log(hashedPassword)
    const newUser =  await User.create({
        email: req.body.email,
        password: hashedPassword
    })

    newUser.save().then().catch(e => console.log(e))
    console.log(newUser)
    res.redirect("login.html");
})

function checkAuth(req, res, next){
    let bool = req.isAuthenticated()
    if(bool){
        next()
    } else {
        res.send("I cant let you through")
    }
}

app.get("/secretSite", checkAuth, (req, res) => [
    res.send("<h1>This is the secret site</h1>")
])

app.listen(3000)