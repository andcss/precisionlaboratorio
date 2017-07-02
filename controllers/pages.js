
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
  res.render('pages/agenda', {
    title: 'Agenda'
  });
};

exports.portifolio = (req, res) => {
  res.render('pages/portifolio', {
    title: 'Portifólio'
  });
};

exports.sac = (req, res) => {
  res.render('pages/fac', {
    title: 'FAC'
  });
};
