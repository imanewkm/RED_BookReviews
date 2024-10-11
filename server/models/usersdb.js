const bcrypt = require('bcrypt');

// Local Database structure
let users = {
    // user
    "User" : {
        username: "Username",
        password: bcrypt.hashSync("password123", 10), // Hashed password
        email: "example@example.com"
    }
};

// Export the users "database"
module.exports = { users };