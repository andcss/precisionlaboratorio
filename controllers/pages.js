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
  }).sort({startDate: -1}).exec((err, findEvents) => {
    res.render('pages/agenda', {
      title: 'Agenda',
      destaque: findEvents[0],
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
