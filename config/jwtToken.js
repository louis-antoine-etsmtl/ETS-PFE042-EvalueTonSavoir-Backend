const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Response = require('../helpers/Response.js')

dotenv.config();

class Token {

    constructor() {

    }

    create(email, userId) {
        return jwt.sign({ email, userId }, process.env.JWT_SECRET);
    }

    authenticate(req, res, next) {
        try {
            const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

            if (!token) Response.unauthorized(res, 'Accès refusé. Aucun jeton fourni');

            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) Response.unauthorized("Accès refusé. Jeton invalide.");

                req.user = payload;

                next();
            });
        } catch (e) {
            console.log(e);
            return Response.serverError(res, "");
        }

    }
}

module.exports = new Token();