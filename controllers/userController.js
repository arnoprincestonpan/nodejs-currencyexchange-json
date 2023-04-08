const express = require("express")
const dataObject = require("../data.json")
let Users = dataObject.users
const fs = require('fs')

const getUsernames = (req, res, next) => {
    try{

    } catch (error) {

    }
}

const addUser = (req, res, next) => {
    try {
        const newUser = req.body
        if(Object.keys(newUser).length !== 0){
            const requiredFields = [
                "username",
                "password",
                "email",
                "role"
            ]
            if(requiredFields.every(field => newUser[field])){
                Users.push({...newUser})
                fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
                res.status(201).send(newUser)
            } else {
                const err = new Error(`Please enter username, password, email and role.`)
                err.status = 400
                next(err)
            }
        } else {
            const err = new Error(`No data was passed.`)
            err.status = 400
            next(err)
        }
    } catch (error) {

    }
}

const deleteUser = (req, res, next) => {
    try {
        const userIndex = Users.findIndex(user => user.username.toLowerCase() === req.params.toLowerCase())
        if(userIndex !== -1){
            Users.pop(Users[userIndex])
            fs.writeFileSync("data.json", JSON.stringify(Users, null, 4))
            res.status(200).send({
                message: `${Users[userIndex].abbreviation.toUpperCase()} deleted.`
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsernames,
    addUser,
    deleteUser
}