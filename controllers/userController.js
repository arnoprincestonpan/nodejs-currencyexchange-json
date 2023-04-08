const express = require("express")
const dataObject = require("../data.json")
let Users = dataObject.users
const fs = require('fs')

const errorHandler = (err, res, req, next) => {
    if (err) {
        console.error(err.message);
        if (err.status === 404) {
          res.status({
            error: err.message,
          });
        } else if (err.status === 400) {
          res.status({
            error: err.message,
          });
        } else {
          res.status(500).send({
            error: err.message,
          });
        }
      } else {
        next();
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

module.exports = {
    addUser
}