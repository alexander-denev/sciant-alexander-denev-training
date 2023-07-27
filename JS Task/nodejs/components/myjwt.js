const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class Main {
  constructor() {
    this.secret = crypto.randomBytes(32).toString('hex');
  }

  createToken(object) {
    return jwt.sign(object, this.secret);
  }

  authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // If token is missing

    jwt.verify(token, this.secret, (err, object) => {
      if (err) return res.sendStatus(401); // If token is invalid
      req.authObject = object;
      next();
    });
  }
}

module.exports = Main;
