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
    findUser: new User(),
    newUser: true,
  });
};

exports.postNewUser = (req, res) => {
  var user = new User();
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
    return res.redirect('/dashboard/user/'+newUser._id);
  })

  res.render('viewsdash/pages/profile', {
    title: preTitle+ 'Novo usuário',
    pageName: 'users',
    findUser: new User()
  });
};

exports.getGalleries = (req, res) => {
  res.render('viewsdash/pages/gallery', {
    title: preTitle+ 'Galerias',
    pageName: 'gallery',
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

exports.getPedidos = (req, res) => {
  res.render('viewsdash/pages/pedidos', {
    title: preTitle+ 'Meus pedidos',
    pageName: 'pedidos',
    user: req.user,
  });
};

exports.getConfig = (req, res) => {

  res.render('viewsdash/pages/config', {
    config: req.config,
  });
};
