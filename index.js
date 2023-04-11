const passport = require("passport")
const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()
require("./controllers/auth/passport")

const currencyRoute = require("./routes/currencyRoute")
const userRoute = require('./routes/userRoute')

const app = express()
const PORT = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

// initialize session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

// initialize passport middleware 
app.use(passport.initialize())
app.use(passport.session())

app.use("/", currencyRoute)
app.use("/", userRoute)

app.get("/", (req, res) => {
    console.log("Server Node and Express")
    res.send("You are now connected. Serving Node Express.")
})

app.listen(PORT, () => {
    console.log("Serving on PORT: " + PORT)
})