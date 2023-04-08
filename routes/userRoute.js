const express = require("express")
const dataObject = require("../data.json")
const Users = dataObject.users
const { addUser, deleteUser } = require("../controllers/userController")
const { errorHandler } = require("../controllers/errorHandler")

const router = express.Router()

// get all usernames (make sure NOT to include passwords, also this should be restricted to admin/manager roles)
router.get("/api/users/")

// add user
router.post("/api/users/", errorHandler, addUser)

// delete user
router.delete('/api/user/:abbreviation', errorHandler, deleteUser)

module.exports = router