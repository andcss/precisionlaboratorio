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
  User.find({}).populate('_role').exec((err, users) => {
    if (err) {
      redirect('/');
    } else {
      res.render('viewsdash/pages/users', {
        title: preTitle + 'Usuários Cadastrados',
        config: req.config,
        pageName: 'users',
        users
      });
    }
  });

};


exports.getPages = (req, res) => {
  res.render('viewsdash/pages/pages', {
    title: preTitle+ 'Páginas institucionais',
    pageName: 'pages',
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

exports.getPedidos = (req, res) => {
  res.render('viewsdash/pages/pedidos', {
    title: preTitle+ 'Meus pedidos',
    pageName: 'pedidos',
    user: req.user,
  });
};


exports.getConfig = (req, res) => {
  res.render('viewsdash/pages/config', {
    title: preTitle+ 'Configurações do sistemas',
    pageName: 'config',
    config: req.config,
    newRole: true,
  });
};
