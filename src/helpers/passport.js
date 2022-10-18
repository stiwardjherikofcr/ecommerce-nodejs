const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database/db');
const helpers = require('../helpers/bcrypt');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM cliente WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        if (user.active == 1) {
            const validPassword = await helpers.matchPassword(password, user.password);
            if (validPassword) {
                done(null, user, req.flash('success', `Welcome ${user.username}`));
            } else {
                done(null, false, req.flash('error', 'Incorrect Password'));
            }
        } else {
            done(null, false, req.flash('message', 'Your account is not active'));
        }
    } else {
        return done(null, false, req.flash('error', 'The Username does not exist'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname, email, phone, address, image } = req.body;
    const newUser = {
        fullname,
        email,
        phone,
        address,
        image,
        id_role: 1,
        active: 1,
        username,
        password
    };
    newUser.image = req.file.filename;
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO cliente SET ?', [newUser]);
    newUser.id_customer = result.insertId;
    return done(null, newUser, req.flash('success', 'You are now registered'));
}));

passport.serializeUser((user, done) => {
    done(null, user.id_customer);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM cliente WHERE id_customer = ?', [id]);
    done(null, rows[0]);
});
