const express = require("express");
const bcrypt = require("bcryptjs");
// salt round, this the difficulty of "salt", or difficulty level of encryption
const saltRounds = 10;
const dataObject = require("../data.json");
let Users = dataObject.users;
const fs = require("fs");
const passport = require("passport");

const login = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({
          message: "Invalid email or password.",
        });
      }
      await req.logIn(user, async (err) => {
        try {
          if (err) {
            return next(err);
          }
          return res.json({ message: "Login successful." });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    await req.logout(() => {});
    res.status(200).send("User logged out successfully.");
  } catch (error) {
    next(error);
  }
};

const getUsernames = async (req, res, next) => {
  try {
    if (Users !== undefined || Users !== null) {
      res.status(200).send(Users.map((users) => users.username));
    } else {
      const err = new Error(`Check JSON file or Users property is empty.`);
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    if (Object.keys(newUser).length !== 0) {
      const requiredFields = ["username", "password", "email", "role"];
      // check if all fields have been filled
      if (requiredFields.every((field) => newUser[field])) {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        const user = { ...newUser, password: hashedPassword };
        Users.push(user);
        fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
        req.login(user, (err) => {
          if(err){
            next(err)
          } else {
            res.status(201).send(newUser)
          }
        })
      } else {
        const err = new Error(
          `Please enter username, password, email and role.`
        );
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error(`No data was passed.`);
      err.status = 400;
      next(err);
    }
  } catch (error) {
    next(error)
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userIndex = Users.findIndex(
      (user) => user.username.toLowerCase() === req.params.username.toLowerCase()
    );
    if (userIndex !== -1) {
      Users.pop(Users[userIndex]);
      fs.writeFileSync("data.json", JSON.stringify({...dataObject, Users}, null, 4));
      res.status(200).send({
        message: `${req.params.username.toLowerCase()} deleted.`,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const userIndex = Users.findIndex(
      (user) => user.username.toLocaleLowerCase() === req.params.username.toLowerCase()
    );
    if (userIndex !== -1) {
      let updatedUser = Users[userIndex];

      bcrypt.genSaltSync(saltRounds, (err, hash) => {
        if (err) {
          throw err;
        } else {
          updatedUser = {
            ...Users[userIndex],
            password: req.body.password ? hash : updatedUser.password,
          };
          Users[userIndex] = updatedUser;
          writeJSON()
          res.status(200).send({
            message: `${req.params.username} updated.`,
          });
        }
      });
    } else {
      const err = new Error(`${req.params.username} not found.`);
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

const writeJSON = () => {
  fs.writeFileSync("data.json", JSON.stringify(null, dataObject, 4))
}

module.exports = {
  getUsernames,
  addUser,
  deleteUser,
  updateUserPassword,
  login,
  logout,
};
