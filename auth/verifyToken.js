const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
  const token = req.headers['Authorization'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.SECURE_KEY_JWT, (err, decoded) => {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded._id;
    next();
  });
}

module.exports = verifyToken;