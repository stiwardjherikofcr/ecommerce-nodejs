const passport = require('passport');

const authController = {};

authController.signupForm = (req, res) => res.render("auth/signup");

authController.signup = async (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/account/profile',
        failureRedirect: '/auth/signup',
        failureFlash: true
    })(req, res, next);
}

authController.signinForm = (req, res) => res.render("auth/signin");

authController.signin = async (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/account/profile',
        failureRedirect: '/auth/signin',
        failureFlash: true
    })(req, res, next);
}

authController.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

module.exports = authController;