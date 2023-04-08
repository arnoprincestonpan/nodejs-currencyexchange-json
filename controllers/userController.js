const express = require("express")
const bcrypt = require("bcryptjs")
// salt round, this the difficulty of "salt", or difficulty level of encryption
const saltRounds = 10
const dataObject = require("../data.json")
let Users = dataObject.users
const fs = require('fs')

const getUsernames = (req, res, next) => {
    try {
        
    } catch (error) {

    }
}

const addUser = (req, res, next) => {
    try {
        const newUser = req.body
        if (Object.keys(newUser).length !== 0) {
            const requiredFields = [
                "username",
                "password",
                "email",
                "role"
            ]
            // check if all fields have been filled
            if (requiredFields.every(field => newUser[field])) {
                // Hash the password before saving it
                bcrypt.genSaltSync(saltRounds, (err, salt) => {
                    if (err) {
                        throw err
                    }
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err
                        }
                        // replace the password with hashed
                        const user = { ...newUser, password: hash }
                        // push the entered information into the Users property
                        Users.push(user)
                        fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
                        res.status(201).send(newUser)
                    })

                })
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
        if (userIndex !== -1) {
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