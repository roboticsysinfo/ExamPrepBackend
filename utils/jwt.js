const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};
