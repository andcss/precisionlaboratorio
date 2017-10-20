const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const mongoose = require('mongoose');
const requestify = require('requestify');

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
  let reset = req.query.reset ? req.query.reset : false;
  res.render('pages/login', {
    title: 'Login',
    signup,
    reset,
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
      req.flash('success', { msg: 'Seu acesso foi efetuado com sucesso!' });
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

// Validate CRO
function validationCRO(cro, type, uf) {
  const apiKey = '7849682889';
  let baseApiUrl = `http://www.consultacrm.com.br/api/index.php?tipo=cro&q=${cro}&uf=${uf}&chave=${apiKey}&destino=json`

  return new Promise ((resolve, reject) => {
    requestify.get(baseApiUrl).then((res) => {
      let body = res.getBody();
      let parseBody = JSON.parse(body);

      let findCro = parseBody.item.filter((apiCro) => {
        return apiCro.numero == `${uf}-${type}-${cro}`;
      });
      resolve(findCro);
    }).fail(function(response) {
      reject();
  	});
  });
}

function createUser(req, res, infosUser) {

  const user = new User(infosUser);

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      req.flash('user', infosUser);
      return res.redirect('/login?signup=true');
    }

    if (existingUser) {
      req.flash('errors', { msg: 'Email já cadastrado!' });
      req.flash('user', infosUser);
      return res.redirect('/login?signup=true');
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
}

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
    typeCro: req.body.typeCro || '',
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

  validationCRO(req.body.cro, req.body.typeCro, req.body.ufCro).then((resApiCro) => {
    infosUser.validationCRO = true;
    createUser(req, res, infosUser);
  }).catch(() => {
    infosUser.validationCRO = false;
    createUser(req, res, infosUser);
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

    if (req.user._role && req.user._role.value > 9) {
      user.ufCro = req.body.ufCro || '';
      user.status = req.body.status || '';
      user.cro = req.body.cro || '';
      user.validationCRO = req.body.validationCRO || false;
      user.typeCro = req.body.typeCro || '';
      if (req.body.role)
        user._role = mongoose.Types.ObjectId(req.body.role);
    }

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
      res.redirect('/login?reset=true')
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
    return res.redirect('/login?reset='+req.params.token);
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Seu token para nova senha expirou.' });
          return res.redirect('/login');
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
      host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'tnavarrodesenvolvimento@gmail.com', // generated ethereal user
          pass: 'tu08686040'  // generated ethereal password
        }
    });
    const mailOptions = {
      to: user.email,
      from: 'contato@precisionlaboratorio.com.br',
      subject: 'Precision - Senha alterado com sucesso',
      text: `Olá,\n\nEste email é uma confirmação que sua senha do login ${user.email} foi alterada.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Você receberá um email com o link para criar uma nova senha' });
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
  res.redirect('/login')
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Este email não é válido.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
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
      host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'tnavarrodesenvolvimento@gmail.com', // generated ethereal user
          pass: 'tu08686040'  // generated ethereal password
        }
    });
    const mailOptions = {
      to: user.email,
      from: 'contato@precisionlaboratorio.com.br',
      subject: 'Precision - Recuperação de senha',
      text: `Você está recebendo este e-mail porque você (ou outra pessoa) solicitou a recuperação de senha da sua conta.\n\n
        Por favor, clique no link a seguir, ou cole este no seu navegador para concluir o processo:\n\n
        http://${req.headers.host}/login?reset=${token}\n\n
        Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `Um e-mail foi enviado para ${user.email} com mais instruções.` });
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
  user.validationCRO = req.body.validationCRO || false;
  user.typeCro = req.body.typeCro || '';
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

  user.save((err, newUser) => {
    if(err) {
      req.flash('errors', { msg: `Erro ao salvar dados` });
      return res.redirect('/dashboard/users');
    }
    return res.redirect('/user/' + newUser._id);
  });
};

exports.deleteUser = (req, res) => {
  User.findById(req.params.id).exec((err, findUser) => {
    if (err) {
      req.flash('errors', { msg: `Erro ao salvar dados` });
      return res.redirect('/dashboard/users');
    }
    if (findUser.email == req.user.email) {
      req.flash('errors', { msg: `Você não pode apagar seu usuário.` });
      return res.redirect('/dashboard/users');
    }
    findUser.remove((err) => {
      if (err) {
        req.flash('errors', { msg: `Erro ao deletar usuário` });
        return res.redirect('/dashboard/users');
      }
      req.flash('success', { msg: `Usuário deletado` });
      return res.redirect('/dashboard/users');
    });
  });
}
