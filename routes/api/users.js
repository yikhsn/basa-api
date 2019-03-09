const asyncMiddleware = require('../../middleware/async');

const express = require('express');
const bcyrpt = require('bcrypt');

const auth = require('../../middleware/auth');

const router = express.Router();
const { User, validate } = require('../../models/user');

router.get('/profile', auth, asyncMiddleware( async(req, res) => {
    const user = await User.findById(req.user._id);

    res.send(user);
}));

router.post('/', asyncMiddleware( async(req, res) => {
    // validate the user data and send res '404' status
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if the email user input is not store yet in database
    let user = await User.findOne( { email: req.body.email } );  
    if (user) return res.status(400).send('User already registered');

    // create new object by the req body data
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password 
    });

    // hashed the input password
    const salt = await bcyrpt.genSalt(10);
    user.password = await bcyrpt.hash(user.password, salt);

    // save the data wrap it into the catch block
    user = await user.save();
 
    // create token with json web token based on user _id on the database
    const token = user.generateAuthToken();

    // send respon body and header to the client
    res.header('x-auth-token', token).send(user);
}));

module.exports = router;