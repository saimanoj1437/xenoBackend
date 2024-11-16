const crypto = require('crypto');

// Generate a random 64-byte string and output it as a hex string
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Generated JWT Secret Key:', secretKey);
