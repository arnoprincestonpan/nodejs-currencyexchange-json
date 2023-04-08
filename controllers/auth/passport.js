const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")

const dataObject = require("../../data.json")
const Users = dataObject.users

passport.use(
    new LocalStrategy(async (username, password, done) => {
        const allUsers = [...Users, ...process.env.ADMIN.admins]
        try {
            const user = allUsers.find((user) => user.username === username)
            // check all existing usernames
            if (!user) {
                return done(null, false, { message: "No such username." })
            }
            // check for admin
            if (process.env.ADMIN.admins.find(user) === user) {
                // get the index of the username. NOTE: I used the .env file, to separate from the users
                const adminIndex = process.env.ADMIN.admins.findIndex(user)
                // check the password, this way you won't get to log in because someone else has the same password
                const isMatch = await bcrypt.compare(password, process.env.ADMIN.admins[adminIndex].password)
                if(isMatch){
                    return(done(null, process.env.ADMIN.admins[adminIndex]))
                } else {
                    return done(null, false, {
                        message: `Invalid password for admin user: ${user}`
                    })
                }
            } else {
                // get the index of the username. NOTE: I used the JSON file, to separate from the admins
                const userIndex = Users.findIndex(user)
                // check the password, this way you won't get to log in because someone else has the same password
                const isMatch = await bcrypt.compare(password, Users[userIndex].password)
                if(isMatch){
                    return(done(null, Users[userIndex]))
                } else {
                    return(done(null, false, {
                        message: `Invalid password for user: ${user}`
                    }))
                }
            }
        } catch (error) {
            return done(error)
        }
    }
    )
)
