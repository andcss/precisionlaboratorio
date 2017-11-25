const cloudinary = require('./cloudinary');

const moment = require('moment');
const Event = require('../models/Event');
const Page = require('../models/Page');

/**
 * GET /
 * Páginas institucionais
 */

exports.laboratorio = (req, res) => {
  Page.findOne({ name: 'Laboratorio' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/dashboard/pages');
    }

    if (!pageInfo) {
      return res.redirect('/404');
    }

    else {
      res.render('pages/laboratorio', {
        title: 'Laboratório',
        pageInfo
      })
    }
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
      pageInfo: {
        seo: {
          title: 'Precision - Laboratório de excelência',
          descripton: 'Perfeição depende dos conhecimentos adquiridos e da experiência aplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.',
          urlImage: '/images/capa-preview.png',
        }
      }
    });
  });

};

exports.error404 = (req, res) => {
  res.render('pages/404', {
    title: 'Precision - Página não encontrada',
    pageInfo: {}
  });
}


/**
 * Edit Pages /
 * Páginas institucionais dashboard
 */

function createHome() {
  return new Promise((resolve, reject) => {
    const home = new Page({
      name: 'Home',
      customFields: {
        titleMesage: 'Laboratório de Excelência.',
        mesage: '“Perfeição depende dos conhecimentos adquiridos e da experiênciaaplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.”',
      },
      seo: {
        title: 'Precision - Laboratório de excelência',
        descripton: 'Perfeição depende dos conhecimentos adquiridos e da experiênciaaplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.',
        urlImage: '/images/capa-preview.png',
      }
    });

    home.save((err, pageInfo) => {
      return resolve(pageInfo);
    });
  });

}


exports.index = (req, res) => {
  var ua = req.header('user-agent');
  Page.findOne({ name: 'Home' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/404');
    }
    res.render('pages/home', {
      title: 'Precision - Laboratório de execelência',
      pageInfo,
      mobile: /mobile/i.test(ua)
    });
  });
};

exports.postHome = (req, res) => {
  Page.findOne({ name: 'Home' }).exec((err, pageInfo) => {
    if (err) {
      req.flash('errors', { msg: 'Não foi possível salvar a página.' });
      return res.redirect('/page/home');
    }

    pageInfo.customFields.titleMesage = req.body.titleMesage;
    pageInfo.customFields.mesage = req.body.mesage;
    pageInfo.seo.title = req.body.seoTitle;
    pageInfo.seo.descripton = req.body.seoDescription;
    pageInfo.markModified('customFields');
    pageInfo.markModified('seo');

    pageInfo.save((err, pageSave) => {
      if (err) {
        req.flash('errors', { msg: 'Erro ao salvar Home' });
        return res.redirect('/page/home');
      }

      if (req.files.seoImage.originalFilename != '') {
        cloudinary.v2.uploader.upload(req.files.seoImage.path,
          {
            resource_type: "auto"
          },
          function(err, returnFileUpdate) {
            if (err) {
              req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' });
              return res.redirect('/events');
            }

            pageSave.seo.urlImage = returnFileUpdate.secure_url;

            pageSave.save((err, pageSave) => {
              if(err) {
                req.flash('error', { msg: 'Não foi possivel salvar a página' });
                return res.redirect('/page/home');
              }
              req.flash('success', { msg: 'Página alterada com sucesso!' });
              return res.redirect('/pages');
            })
          });
      } else {
        req.flash('success', { msg: 'Página alterada com sucesso!' });
        return res.redirect('/pages');
      }
    });
  });
}

exports.editHome = (req, res) => {
  Page.findOne({ name: 'Home' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/dashboard/pages');
    }

    if (!pageInfo) {
      createHome().then((pageCreated) => {
        res.render('viewsdash/pages/editPages/home', {
          title: 'Editar Página Inicial',
          user: req.user,
          pageInfo: pageCreated,
        });
      });
    }

    else {
      res.render('viewsdash/pages/editPages/home', {
        title: 'Editar Página Inicial',
        user: req.user,
        pageInfo,
      });
    }
  });
}

function createLaboratorio() {
  return new Promise((resolve, reject) => {
    const laboratorio = new Page({
      name: 'Laboratorio',
      customFields: {
        historia: '',
        sobre: '',
        proposito: '',
        digital: '',
      },
      seo: {
        title: 'Precision - Laboratório de excelência',
        descripton: 'Perfeição depende dos conhecimentos adquiridos e da experiênciaaplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.',
        urlImage: '/images/capa-preview.png',
      }
    });

    laboratorio.save((err, pageInfo) => {
      return resolve(pageInfo);
    });
  });
}

exports.editLaboratorio = (req, res) => {
  Page.findOne({ name: 'Laboratorio' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/dashboard/pages');
    }

    if (!pageInfo) {
      createLaboratorio().then((pageCreated) => {
        res.render('viewsdash/pages/editPages/laboratorio', {
          title: 'Editar Laboratóio',
          user: req.user,
          pageInfo: pageCreated
        })
      });
    }

    else {
      res.render('viewsdash/pages/editPages/laboratorio', {
        title: 'Editar Laboratóio',
        user: req.user,
        pageInfo
      })
    }
  });

}

exports.postLaboratorio = (req, res) => {

  Page.findOne({ name: 'Laboratorio' }).exec((err, pageInfo) => {
    if (err) {
      req.flash('errors', { msg: 'Não foi possível salvar a página.' });
      return res.redirect('/page/laboratorio');
    }

    pageInfo.customFields.historia = req.body.historia;
    pageInfo.customFields.sobre = req.body.sobre;
    pageInfo.customFields.proposito = req.body.proposito;
    pageInfo.customFields.digital = req.body.digital;

    pageInfo.seo.title = req.body.seoTitle;
    pageInfo.seo.descripton = req.body.seoDescription;
    pageInfo.markModified('customFields');
    pageInfo.markModified('seo');

    pageInfo.save((err, pageSave) => {
      if (err) {
        req.flash('errors', { msg: 'Erro ao salvar Home' });
        return res.redirect('/page/laboratorio');
      }

      if (req.files.seoImage.originalFilename != '') {
        cloudinary.v2.uploader.upload(req.files.seoImage.path,
          {
            resource_type: "auto"
          },
          function(err, returnFileUpdate) {
            if (err) {
              req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' });
              return res.redirect('/page/laboratorio');
            }

            pageSave.seo.urlImage = returnFileUpdate.secure_url;

            pageSave.save((err, pageSave) => {
              if(err) {
                req.flash('error', { msg: 'Não foi possivel salvar a página' });
                return res.redirect('/page/laboratorio');
              }
              req.flash('success', { msg: 'Página alterada com sucesso!' });
              return res.redirect('/page/laboratorio');
            })
          });
      } else {
        req.flash('success', { msg: 'Página alterada com sucesso!' });
        return res.redirect('/page/laboratorio');
      }
    });
  });
}

function createPortfolio() {
  return new Promise((resolve, reject) => {
    const portfolio = new Page({
      name: 'Portfolio',
      customFields: {
        images: []
      },
      seo: {
        title: 'Precision - Laboratório de excelência',
        descripton: 'Perfeição depende dos conhecimentos adquiridos e da experiênciaaplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.',
        urlImage: '/images/capa-preview.png',
      }
    });

    portfolio.save((err, pageInfo) => {
      return resolve(pageInfo);
    });
  });
}



exports.editPortfolio = (req, res) => {
  Page.findOne({ name: 'Portfolio' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/dashboard/pages');
    }

    if (!pageInfo) {
      createPortfolio().then((pageCreated) => {
        res.render('viewsdash/pages/editPages/portfolio', {
          title: 'Editar Portfolio',
          pageInfo: pageCreated,
        })
      });
    }

    else {
      res.render('viewsdash/pages/editPages/portfolio', {
        title: 'Editar Portfolio',
        user: req.user,
        pageInfo,
      })
    }
  });

}

exports.postPortfolioMidia = (req, res) => {
  Page.findOne({ name: 'Portfolio' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/pages/portfolio');
    }
    if (req.files.fileUpdate.originalFilename != '') {
      cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
        {
          resource_type: "auto"
        },
        function(err, returnFileUpdate) {
          if (err) {
            req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' });
            return res.redirect('/events');
          }

          pageInfo.customFields.images.push({
            url_image: returnFileUpdate.secure_url,
            public_id: returnFileUpdate.public_id
          });
          pageInfo.markModified('customFields.images');
          pageInfo.save((err, pageSave) => {
            if(err) {
              req.flash('error', { msg: 'Não foi possivel salvar o novo arquivo' });
              return res.redirect('/page/portfolio');
            }
            req.flash('success', { msg: 'Nova Imagens salva com sucesso!' });
            return res.redirect('/page/portfolio');
          })
        });
    } else {
      req.flash('error', { msg: 'Selecione uma imagem' });
      return res.redirect('/page/portfolio');
    }

  });
}

exports.deletePortfolioMidia = (req, res) => {
  Page.findOne({ name: 'Portfolio' }).exec((err, pageInfo) => {
    if (err) {
      req.flash('error', { msg: 'Não foi possivel apagar o arquivo' });
      return res.redirect('/pages/portfolio');
    }

    cloudinary.v2.uploader.destroy(
      pageInfo.customFields.images[req.params.id].public_id,
      (error, result) => {
        if (error) {
          req.flash('error', { msg: 'Não foi possivel apagar o arquivo' });
          return res.redirect('/page/portfolio');
        }
        pageInfo.customFields.images.splice(req.params.id, 1);
        pageInfo.markModified('customFields.images');
        pageInfo.save((err, pageSave) => {
          if(err) {
            req.flash('error', { msg: 'Não foi possivel apagar o arquivo' });
            return res.redirect('/page/portfolio');
          }
          req.flash('success', { msg: 'Imagem removida com sucesso!' });
          return res.redirect('/page/portfolio');
        });
    });
  });
}

exports.portfolio = (req, res) => {
  Page.findOne({ name: 'Portfolio' }).exec((err, pageInfo) => {
    if (err) {
      res.redirect('/404');
    }

    res.render('pages/portifolio', {
      title: 'Portifólio',
      pageInfo
    });

  });

};

exports.postPortfolio = (req, res) => {
  res.render('viewsdash/pages/editPages/portfolio', {
    title: 'Editar Portfolio',
    user: req.user,
  })
}


function createProdutos() {
  return new Promise((resolve, reject) => {
    const produtos = new Page({
      name: 'Pro]dutos',
      customFields: {
        produtos: [
          {
            name: 'Enceramento diagnóstico por elemento',
            descripton: 'Projeto estético e funcional que será utilizado para o planejamento do plano de tratamento, posicionamento de futuros implantes e trocas de pinos (núcleos). A partir desse enceramento diagnóstico podemos obter as muralhas de silicone que serão utilizadas na confecção do mock up e servirão também como guia para preparos.  ',
            url_image: '',
          },

          {
            name: 'Protocolo cerâmico dento gengival completo (ZR + Emax + Aplicação de gengiva)',
            descripton: 'Prótese total parafusada que tem como objetivo reconstruir dentes e gengiva.',
            url_image: '',
          },
          {
            name: 'Coping ZR',
            descripton: 'Infraestrutura em zircônia opaca, aplicada internamente nas coroas, indicadas para dentes com remanescente dental em metal ou escurecidos funcionando como um bloqueio desse escurecimento.',
            url_image: '',
          },
          {
            name: 'Coroa Total',
            descripton: 'Elementos cerâmicos que revestem os dentes por completo, indicados para casos com alto grau de destruição.',
            url_image: '',
          },

          {
            name: 'Lente de contato Emax',
            descripton: 'Como uma “película” sobre o dente, as lentes de contato são extremamente finas (entre 0,3 e 0,6mm) e revestem a face vestibular dos dentes, devolvendo a forma e o aspecto natural e com melhor resultado estético, utilizando meios menos invasivos, porém, pela alta translucidez não é indicada para alteração de cor.',
            url_image: '',
          },

          {
            name: 'Faceta laminada Emax',
            descripton: 'Laminado cerâmico. As facetas revestem a face vestibular em dentes manchados, quebrados, com deformidades ou desgastados, devolvendo a forma, a cor e o aspecto natural de um dente saudável e com melhor resultado estético.',
            url_image: '',
          },

          {
            name: 'Inlay/Onlay Emax',
            descripton: 'Elementos utilizados na reconstrução parcial e de uma forma estética dos dentes posteriores, que sofreram algum tipo de dano por desgaste natural, trauma, cárie que precisam de reconstrução estética e funcional. ',
            url_image: '',
          },

          {
            name: 'Coroa sobre implante parafusada ou cimentada (ZR + Emax)',
            descripton: 'Fabricadas em cerâmica com reforço interno em Zircônia e parafusadas sobre implantes devolvendo assim elementos dentais perdidos.',
            url_image: '',
          },

          {
            name: 'Coroa ZR monolítica maquiada',
            descripton: 'Coroa total elaborada em zircônia translucida, com personalização de cor por meio de maquiagem, indicada para dentes posteriores que têm alto grau de destruição.',
            url_image: '',
          },
        ]
      },
      seo: {
        title: 'Precision - Laboratório de excelência',
        descripton: 'Perfeição depende dos conhecimentos adquiridos e da experiênciaaplicada entre os técnicos e cirurgiões dentistas comprometidos com o resultado.',
        urlImage: '/images/capa-preview.png',
      }
    });

    produtos.save((err, pageInfo) => {
      return resolve(pageInfo);
    });
  });

}


exports.editProdutos = (req, res) => {

  Page.findOne({ name: 'Produtos' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/dashboard/pages');
    }

    if (!pageInfo) {
      createProdutos().then((pageCreated) => {
        res.render('viewsdash/pages/editPages/produtos', {
          title: 'Editar Produtos e Serviços',
          user: req.user,
          pageInfo: pageCreated,
        });
      });
    }

    else {
      res.render('viewsdash/pages/editPages/produtos', {
        title: 'Editar Produtos e Serviços',
        user: req.user,
        pageInfo,
      });
    }
  });

}

exports.postProdutos = (req, res) => {
  Page.findOne({ name: 'Produtos' }).exec((err, pageInfo) => {
    if (err) {
      req.flash('errors', { msg: 'Erro ao salvar produto' });
      return res.redirect('/page/produtos');
    }
    pageInfo.seo.title = req.body.seoTitle;
    pageInfo.seo.descripton = req.body.seoDescription;

    pageInfo.save((err, pageSave) => {
      if (err) {
        req.flash('errors', { msg: 'Erro ao salvar Home' });
        return res.redirect('/page/home');
      }

      if (req.files.seoImage.originalFilename != '') {
        cloudinary.v2.uploader.upload(req.files.seoImage.path,
          {
            resource_type: "auto"
          },
          function(err, returnFileUpdate) {
            if (err) {
              req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' });
              return res.redirect('/events');
            }

            pageSave.seo.urlImage = returnFileUpdate.secure_url;

            pageSave.save((err, pageSave) => {
              if(err) {
                req.flash('error', { msg: 'Não foi possivel salvar a página' });
                return res.redirect('/page/produtos');
              }
              req.flash('success', { msg: 'Página alterada com sucesso!' });
              return res.redirect('/pages');
            })
          });
      } else {
        req.flash('success', { msg: 'Página alterada com sucesso!' });
        return res.redirect('/pages');
      }
    });
  });
}


function saveProduto(pageInfo, req, res) {
  pageInfo.markModified('customFields.produtos');
  pageInfo.save((err) => {
    if (err) {
      req.flash('errors', { msg: 'Erro ao salvar produto' });
      return res.redirect('/page/produtos');
    } else {
      req.flash('success', { msg: 'Produto atualizado' });
      return res.redirect('/page/produtos');
    }
  });
}

exports.postProduto = (req, res) => {
  Page.findOne({ name: 'Produtos' }).exec((err, pageInfo) => {
    if (err) {
      req.flash('errors', { msg: 'Erro ao salvar produto' });
      return res.redirect('/page/produtos');
    }

    if (req.files.fileUpdate.originalFilename != '') {
      cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
        {
          resource_type: "auto"
        },
        function(err, returnFileUpdate) {
          if (err) {
            req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' })
            return res.redirect('/page/produtos');
          }

          pageInfo.customFields.produtos[req.params.id] = {
            name: req.body.name,
            descripton: req.body.descripton,
            url_image: returnFileUpdate.secure_url,
          }
        }
      );
    } else {

      pageInfo.customFields.produtos[req.params.id] = {
        name: req.body.name,
        descripton: req.body.descripton,
        url_image: pageInfo.customFields.produtos[req.params.id].url_image
      }
      saveProduto(pageInfo, req, res);
    }
  });
}

exports.produtos = (req, res) => {
  Page.findOne({ name: 'Produtos' }).exec((err, pageInfo) => {
    if (err) {
      return res.redirect('/404');
    }
    else {
      res.render('pages/produtos', {
        title: 'Produtos e Serviços',
        produtos: pageInfo.customFields.produtos,
        pageInfo
      });
    }
  });
};
