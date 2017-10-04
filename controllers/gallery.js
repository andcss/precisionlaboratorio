const cloudinary = require('cloudinary');

const Gallery = require('../models/gallery');

const preTitle = 'Precision - ';

cloudinary.config({
  cloud_name: 'dgv0w6dst',
  api_key: '543319621828891',
  api_secret: 'CFL7R37APT6tfNNqhkg6W96Z7-o',
  resource_type: 'auto',
});

exports.getGalleries = (req, res) => {
  Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
    if(err) {
      req.flash('errors', { msg: 'Erro ao buscar galeria' });
      return res.redirect('back')
    }
    if(!gallery) {
      req.flash('errors', { msg: 'Não encontramos a galeria' });
      return res.redirect('back')
    }
    res.render('viewsdash/pages/gallery', {
      title: preTitle+ 'Galerias',
      pageName: 'gallery',
      gallery,
    });

  });
};

exports.getNewMidia = (req, res) => {

  res.render('viewsdash/pages/midia', {
    title: preTitle + 'Arquivo de midia',
    pageName: 'gallery',
    newMidia: true,
    config: req.config,
  });

}

exports.getMidia = (req, res) => {

}

exports.postNewMidia = (req, res) => {

  cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
    {
      resource_type: "auto"
    },
    function(err, returnFileUpdate) {
      if (err) {
        req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' })
        return res.redirect('/midia');
      }
      Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
        if (err) {
          req.flash('errors', { msg: 'Não encontramos a galeria.' })
          return res.redirect('/midia');
        }
        if (!gallery) {
          req.flash('errors', { msg: 'Não encontramos a galeria.' })
          return res.redirect('/midia');
        }
        
        gallery.files.push({
          url: returnFileUpdate.secure_url,
          type: returnFileUpdate.resource_type,
          name: req.body.name,
          name: req.body.name,
          format: returnFileUpdate.format,
          description: req.body.description,
          public_id: returnFileUpdate.public_id,
          _role: req.body.role,
        });

        gallery.save((err, saveGallery) => {
          req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
          return res.redirect('/galleries');
        })
      });
    }
  );


}

exports.postMidia = (req, res) => {

}
