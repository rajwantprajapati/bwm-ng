const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {normalizeErrors} = require("../helpers/mongoose");
const config = require("../config");

exports.auth = function(req, res) {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({errors: [{title: 'Data missing', detail: 'Provide email and password!'}]});
    }
    User.findOne({email}, function(err, user) {
        if(err){
           return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(!user) {
            return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'User does not exist'}]});
        }
        if(user.hasSamePassword(password)) {
            // Return JWT Token
            const token = jwt.sign({userId: user.id, username: user.username}, config.SECRET, {expiresIn: '1h'});
            return res.json(token);
        }else{
            return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email or password!'}]});
        }
    });
}

exports.register = function(req, res){
    /* const username = req.body.username,
          email = req.body.email,
          password = req.body.password,
          passwordConfirmation = req.body.passwordConfirmation; */
    // below line is same as above commented lines
    const {username, email, password, passwordConfirmation} = req.body;
    if(!password || !email) {
       return res.status(422).send({errors: [{title: 'Data missing', detail: 'Provide email and password!'}]});
    }

    if(password !== passwordConfirmation) {
        return res.status(422).send({errors: [{title: 'Invalid password', detail: 'Password is not same as confirmation!'}]});
    }

    User.findOne({email}, function(err, existingUser) {
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(existingUser){
            return res.status(422).send({errors: [{title: 'Email already exists', detail: 'User with same email already exist!'}]});
        }

        const user = new User({username, email, password});
        user.save(function(err){
            if(err){
                return  res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            return res.json({"registered": true});
        });
    });
}

exports.authMiddleWare = function(req, res, next) {
    const token = req.headers.authorization;
    if(token) {
        const user = parseToken(token);
        User.findById(user.userId, function(err, user) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            if(user) {
                res.locals.user = user;
                next();
            }else {
                return notAuthorized(res);
            }
        });
    }else{
        return notAuthorized(res);
    }
}

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
    res.status(401).send({title: 'Not Authorized!', detail: 'You need to login to get access'});
}