const express = require("express")
const dataObject = require("../data.json")
const Users = dataObject.users
const { addUser, deleteUser, getUsernames, updateUserPassword } = require("../controllers/userController")
const { errorHandler } = require("../controllers/errorHandler")

const router = express.Router()

// get all user usersnames (NOT admin) (make sure NOT to include passwords, also this should be restricted to admin/manager roles)
router.get("/api/users/", errorHandler, getUsernames)

// add user
router.post("/api/users/", errorHandler, addUser)

// delete user
router.delete('/api/user/:abbreviation', errorHandler, deleteUser)

// update user password
router.patch("/api/user/", errorHandler, updateUserPassword)

module.exports = router