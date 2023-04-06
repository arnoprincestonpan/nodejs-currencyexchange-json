// make sure dotenv has been imported on index.js
const fs = require("fs")
const jwt = require("jsonwebtoken")

const secretKey = process.env.SECRET_KEY

const authenticate = (req, res) => {
    const {usernname, password} = req.body

    const usersJSON = fs.readFileSync("users.json", "utf-8")
    // this uses the "property" of a JSON, different from the currency.JSON
    const users = JSON.parse(usersJSON).users
}