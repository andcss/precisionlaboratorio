const moment = require('moment');
const Event = require('../models/Event');

/**
 * GET /
 * Páginas institucionais
 */
exports.laboratorio = (req, res) => {
  res.render('pages/laboratorio', {
    title: 'Laboratório'
  });
};

exports.produtos = (req, res) => {
  res.render('pages/produtos', {
    title: 'Produtos e Serviços'
  });
};

exports.agenda = (req, res) => {
  Event.find({ $and: [
      { startDate: { $gt: Date.now() } },
      { featured: true }
    ]
  }).sort({startDate: 1}).exec((err, findEvents) => {
    res.render('pages/agenda', {
      title: 'Agenda',
      destaque: findEvents[0] || [],
    });
  });

};

exports.portifolio = (req, res) => {
  res.render('pages/portifolio', {
    title: 'Portifólio'
  });
};

exports.error404 = (req, res) => {
  res.render('pages/404', {
    title: 'Precision - Página não encontrada'
  });
}


/**
 * Edit Pages /
 * Páginas institucionais dashboard
 */
exports.editHome = (req, res) => {
  res.render('viewsdash/pages/editPages/home', {
    title: 'Editar Página Inicial',
    user: req.user,
    pageInfo: {},
  })
}

exports.postHome = (req, res) => {
  res.render('viewsdash/pages/editPages/home', {
    title: 'Editar Página Inicial',
    user: req.user,
    pageInfo: {},
  })
}

exports.editLaboratorio = (req, res) => {
  res.render('viewsdash/pages/editPages/laboratorio', {
    title: 'Editar Laboratóio',
    user: req.user,
  })
}

exports.postLaboratorio = (req, res) => {
  res.render('viewsdash/pages/editPages/laboratorio', {
    title: 'Editar Laboratóio',
    user: req.user,
  })
}

exports.editPortfolio = (req, res) => {
  res.render('viewsdash/pages/editPages/portfolio', {
    title: 'Editar Portfolio',
    user: req.user,
  })
}

exports.postPortfolio = (req, res) => {
  res.render('viewsdash/pages/editPages/portfolio', {
    title: 'Editar Portfolio',
    user: req.user,
  })
}

exports.editProdutos = (req, res) => {
  res.render('viewsdash/pages/editPages/produtos', {
    title: 'Editar Produtos e Serviços',
    user: req.user,
  })
}

exports.postProdutos = (req, res) => {
  res.render('viewsdash/pages/editPages/produtos', {
    title: 'Editar Produtos e Serviços',
    user: req.user,
  })
}
