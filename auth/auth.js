const jwt = require('jsonwebtoken')
const { SECURE_KEY_JWT } = process.env;

module.exports = {
  createJwt: (user) => {
    const userToken = jwt.sign({ email: user.email },
      SECURE_KEY_JWT, { expiresIn: '1hr' })
    return userToken
  },
  verifyJwt: (header) => {
    const decoded = jwt.verify(header, SECURE_KEY_JWT);
    return decoded;
  }
}