const express = require("express")
const dataObject = require("../data.json")
const Users = dataObject.users
const { addUser, deleteUser, getUsernames, updateUserPassword, login, logout} = require("../controllers/userController")
const { errorHandler } = require("../controllers/errorHandler")
const passport = require("passport")

const router = express.Router()

// login
router.post("/api/user/login", passport.authenticate("local"), login)

// logout
router.post("/api/user/logout", logout)

// get all user usersnames (NOT admin) (make sure NOT to include passwords, also this should be restricted to admin/manager roles)
router.get("/api/users/", isAuthenticated, errorHandler, getUsernames)

// add user
router.post("/api/users/", isAuthenticated, errorHandler, addUser)

// delete user
router.delete('/api/user/:username', isAuthenticated, errorHandler, deleteUser)

// update user password
router.patch("/api/user/", isAuthenticated, errorHandler, updateUserPassword)

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.status(401).json({message : "Make sure you sign in."})
} 

module.exports = router