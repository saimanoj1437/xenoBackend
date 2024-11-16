const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;



















// // backend/middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//     // Extract token from the Authorization header (format: "Bearer <token>")
//     const authHeader = req.header('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Authorization token missing or malformed' });
//     }

//     const token = authHeader.split(' ')[1]; // Get the token after "Bearer "

//     try {
//         // Use the JWT secret from environment variables
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user info to the request
//         next();
//     } catch (err) {
//         // Differentiate errors for better debugging
//         if (err.name === 'TokenExpiredError') {
//             res.status(401).json({ message: 'Token expired' });
//         } else if (err.name === 'JsonWebTokenError') {
//             res.status(401).json({ message: 'Token is invalid' });
//         } else {
//             res.status(401).json({ message: 'Authentication failed' });
//         }
//     }
// };

// module.exports = authenticate;
