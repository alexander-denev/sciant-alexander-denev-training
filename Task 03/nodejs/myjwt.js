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

        if (!token) return res.sendStatus(401)

        jwt.verify(token, this.secret, (err, object) => {
            if (err) return res.sendStatus(403)
            req.object = object;
            next();
        });

    }

}

module.exports = Main;