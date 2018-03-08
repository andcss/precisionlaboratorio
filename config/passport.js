const passport = require('passport');
const request = require('request');
const InstagramStrategy = require('passport-instagram').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const OpenIDStrategy = require('passport-openid').Strategy;
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).populate('_role').exec((err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }).populate('_role').exec((err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} não cadastrado` });
    }
    if (user.active == false) {
      return done(null, false, { msg: `Email ${email} foi removido` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Email e senha inválidos.' });
    });
  });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

/**
 * Verifica se usuário é admin
 */

exports.isAdminUser = (req, res, next) => {
    if (req.user){
      var user = JSON.parse(JSON.stringify(req.user));
      if (user._role.value > 9) {
        next();
      }
      else {
        req.flash('error', { msg: 'Usuário não possuí permissão para acesso!' });
        res.redirect('/dashboard/home');
      }
    }
    else {
      req.flash('error', { msg: 'Usuário não possuí permissão para acesso!' });
      res.redirect('/dashboard/home');
    }
 };
