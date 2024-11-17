const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


userSchema.methods.comparePassword = function (candidatePassword) {
    return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

























// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({

//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// });

// module.exports = mongoose.model('User', userSchema);

// // Remove password hashing middleware
// // No need for the pre-save hook to hash the password

// // Remove password comparison method as well
// // (unless you want to compare plaintext passwords)
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     // In case you want to manually compare passwords in future
//     return enteredPassword === this.password;
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;


