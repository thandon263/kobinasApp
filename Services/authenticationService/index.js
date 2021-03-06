const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../../schemaValidation/validation');

// Import Models
const User = require('../../Models/AuthenticationModel/User');

router.post('/register', async (req, res, next) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send({ status: 400, error: { message: error.details[0].message }})

    // Check if the user is available
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send({ status: 400, error: {
        message: "Email already exists."
    }});

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // Save and catch the error
    try {
        const savedUser = await user.save();
        res.status(200).send({ status: 200, user: user._id });
    } catch(err) {
        res.status(400).send(err)
    }
});

// Login
router.post('/login', async (req, res, next) => {
    // Let validate the login form
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send({ error: { status: 400, message: error.details[0].message }})

    // Check if the user is available
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ error: {
        status: 400,
        message: "Email is not found"
    }});

    // Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ status: 400, error: {
        message: "Password is invalid"
    }});

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '5h' });
    res.header('auth-token', token).status(200).send({ status: 200, payload: {
        message: "Logged In",
        auth_token: token
    }});
});

// Logout
router.post('/logout', async (req, res, next) => {
    // Check if the request header exists (auth-token)
    if (!res.hasHeader('auth-token')) return res.header('auth-token', '').status(200).send({ status: 200, payload: {
        message: "Logged Out",
        auth_token: ''
    }});
});

module.exports = router