const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const currencyRoute = require("./routes/currencyRoute")

const app = express()
const PORT = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

app.use("/", currencyRoute)

app.get("/", (req, res) => {
    console.log("Server Node and Express")
    res.send("You are now connected. Serving Node Express.")
})

app.listen(PORT, () => {
    console.log("Serving on PORT: " + PORT)
})