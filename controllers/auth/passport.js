const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const dataObject = require("../../data.json")
const Users = dataObject.users

// usernameField is like asking req.body for the field "email", kind of like req.body.email
passport.use(new LocalStrategy(async(username, password, done) => {
    const allUsers = [...Users, ...process.env.ADMIN.admins]
    try {
        const user = allUsers.find((user) => user.username === username)
        if(!user){
            return done(null, false, {message: `No such username.`})
        }
        if(process.env.ADMIN.admins.find(user) === user) {
            const adminIndex = process.env.ADMIN.admins.findIndex(user)
            const isMatch = await bcrypt.compare(password, process.env.ADMIN.admin[adminIndex].password)
            if(isMatch){
                return done(null, process.env.ADMIN.admins[adminIndex])
            } else {
                return done(null, false, {
                    message : `Invalid password for admin user : ${user}`
                })
            }
        } else {
            const userIndex = Users.findIndex(user)
            const isMatch = await bcrypt.compare(password, Users[userIndex].password)
            if(isMatch){
                return done(null, Users[userIndex])
            } else {
                return done(null, false, {
                    message: `Invalid password for user: ${user}`
                })
            }
        }
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user)
    })
})

module.exports = passport