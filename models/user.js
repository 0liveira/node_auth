const mongoose = require("mongoose")

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
    newUser.save(callback)
}

module.exports = User