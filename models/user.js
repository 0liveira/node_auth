const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/nodeauth")

const db = mongoose.connection

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
})

const User = mongoose.model("User", UserSchema)

User.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

User.getUserById = (id, callback) => {
    User.findById(id, callback)
}

User.getUserByUsername = (username, callback) => {
    const query = { username }
    User.findOne(query, callback)
}

User.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (error, isMatch) => {
        callback(null, isMatch)
    })
}

module.exports = User