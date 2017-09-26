const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');

const preTitle = 'Precision - ';

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard/home');
  }

  let signup = req.query.signup ? true : false;
  res.render('pages/login', {
    title: 'Login',
    signup,
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email informado não é válido').isEmail();
  req.assert('password', 'Preencha a Senha').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/dashboard/home');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email informado é invalido').isEmail();
  req.assert('password', 'Senha deve conter no mínimo 6 caracteres').len(6);
  req.assert('confirmPassword', 'Confirmação de senha não corresponde').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  const infosUser = {
    email: req.body.email || '',
    password: req.body.password || '',
    telefone: req.body.telefone || '',
    cro: req.body.cro || '',
    ufCro: req.body.ufCro || '',
    howMeet: req.body.howMeet || '',
    profile: {
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
    }
  }

  if (errors) {
    req.flash('errors', errors);
    req.flash('user', infosUser);
    return res.redirect('/login?signup=true');
  }

  const user = new User(infosUser);

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Email já cadastrado!' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/dashboard/home');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('viewsdash/pages/profile', {
    title: 'Informações do perfil',
    config: req.config,
    findUser: req.user,
    newUser: false
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Informe um email válido').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.params.id, (err, user) => {
    if (err) {
      req.flash('errors', errors);
      return res.redirect('/dashboard/users');
    }
    user.email = req.body.email || '';
    user.status = req.body.status || '';
    user.ufCro = req.body.ufCro || '';
    user.cro = req.body.cro || '';
    if (req.body.role)
      user._role = mongoose.Types.ObjectId(req.body.role);

    user.profile.firstName = req.body.firstName || '';
    user.profile.lastName = req.body.lastName || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.office = req.body.office || '';
    user.profile.phone = req.body.phone || '';
    user.profile.profession = req.body.profession || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Email informado já pertence a outra conta.' });
          return res.redirect('back');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Informações do perfil atualizadas com sucesso!' });
      res.redirect('back');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Senha deve conter no mínimo 6 caracteres').len(6);
  req.assert('confirmPassword', 'Confirmação de senha não corresponde').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Senha alterada com sucesso!' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Sua conta foi deletada!' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `Sua conta foi disvinculada do ${provider} ` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Token para nova senha expirou.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Senha deve conter no mínimo 6 caracteres.').len(6);
  req.assert('confirm', 'Confirmação de senha não corresponde').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Seu token para nova senha expirou.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Email não cadastrado' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};

exports.adminConfig = (req, res, next) => {
  res.send(200, { mensagem: 'Área restrita aceita' });
}


exports.getUser = (req, res) => {
  User.findById(req.params.id).populate('_role').exec((err, user) => {
    if (err) {
      req.flash('errors', { msg: `Ocorreru um erro na busca do usuário.` });
      return res.redirect('/dashboard/users');
    }
    if (!user) {
      req.flash('errors', { msg: `Usuário não encontrado!` });
      return res.redirect('/dashboard/users');
    }
    res.render('viewsdash/pages/profile', {
      title: preTitle+ 'Informações de usuário',
      pageName: 'users',
      config: req.config,
      findUser: user,
      newUser: false
    });
  })
};

exports.getNewUser = (req, res) => {
  res.render('viewsdash/pages/profile', {
    title: preTitle+ 'Novo usuário',
    pageName: 'users',
    config: req.config,
    findUser: new User(),
    newUser: true,
  });
};

exports.postNewUser = (req, res) => {
  let user = new User();
  user.email = req.body.email || '';
  user.status = req.body.status || '';
  user.ufCro = req.body.ufCro || '';
  user.cro = req.body.cro || '';
  if (req.body._role)
    user._role = mongoose.Types.ObjectId(req.body._role);

  user.profile.firstName = req.body.firstName || '';
  user.profile.lastName = req.body.lastName || '';
  user.profile.gender = req.body.gender || '';
  user.profile.location = req.body.location || '';
  user.profile.website = req.body.website || '';
  user.profile.office = req.body.office || '';
  user.profile.phone = req.body.phone || '';
  user.profile.profession = req.body.profession || '';

  user.save((err, newUser) => {
    if(err) {
      req.flash('errors', { msg: `Erro ao salvar dados` });
      return res.redirect('/dashboard/users');
    }
    return res.redirect('/user/' + newUser._id);
  });
};
