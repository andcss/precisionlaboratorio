const User = require('../models/User');
const Role = require('../models/Role');
const Config = require('../models/Config');

const preTitle = 'Precision - ';

/**
 * GET /
 * Home contact page.
 */
exports.getHome = (req, res) => {
  res.render('viewsdash/pages/home', {
    title: preTitle + 'Laboratório de execelência',
    pageName: 'dashboard',
    user: req.user,
  });
};

exports.getUsers = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      redirect('/');
    } else {
      res.render('viewsdash/pages/users', {
        title: preTitle + 'Usuários Cadastrados',
        config: req.config,
        pageName: 'users',
        users,
        user: req.user,
      });
    }
  });

};

exports.getUser = (req, res) => {
  res.render('viewsdash/pages/user', {
    title: preTitle+ 'Info usuário',
    pageName: 'users',
    config: req.config,
    user: req.user,
  });
};

exports.getGalleries = (req, res) => {
  res.render('viewsdash/pages/gallery', {
    title: preTitle+ 'Galerias',
    pageName: 'gallery',
    user: req.user,
  });
};

exports.getPages = (req, res) => {
  res.render('viewsdash/pages/pages', {
    title: preTitle+ 'Páginas institucionais',
    pageName: 'pages',
    user: req.user,
  });
};

exports.getEvents = (req, res) => {
  res.render('viewsdash/pages/events', {
    title: preTitle+ 'Eventos',
    pageName: 'events',
    user: req.user,
  });
};

exports.getEvent = (req, res) => {
  res.render('viewsdash/pages/event', {
    title: preTitle+ 'Informações do evento',
    pageName: 'events',
    user: req.user,
  });
};

exports.getConfig = (req, res) => {

  res.render('viewsdash/pages/config', {
    config: req.config,
  });
};
