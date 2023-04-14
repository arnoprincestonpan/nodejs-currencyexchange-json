const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const dataObject = require("../../data.json")
const Users = dataObject.users

// usernameField is like asking req.body for the field "email", kind of like req.body.email
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await Users.find((user) => user.username === username)
        console.log(`Username: ${user.username}`)
        if(!user){
            console.log("No such user.")
            return done(null, false, {message : `No such username: ${username}`})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            console.log("Correct Password.")
            return done(null, user)
        } else {
            console.log("Incorrect Password.")
            return done(null, false, {
                message: `Invalid Password.`
            })
        }
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    try {
        const user = Users.find((user) => user.username === username)
        if(!user){
            return done(null, false, {
                message: `No such user: ${username}`
            })
        }
        return done(null, user)
    } catch (error) {
        return done(error)
    }
})

module.exports = passport