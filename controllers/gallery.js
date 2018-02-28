const cloudinary = require('./cloudinary');

const Gallery = require('../models/Gallery');

const preTitle = 'Precision - ';

exports.getGalleries = (req, res) => {
  var limit = 6;
  var page = req.query.page || 1;
  Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
    if(err) {
      req.flash('errors', { msg: 'Erro ao buscar galeria' });
      return res.redirect('back');
    }
    res.render('viewsdash/pages/gallery', {
      title: preTitle+ 'Galerias',
      pageName: 'gallery',
      gallery,
      countItens: gallery.files.length,
      limit,
      page,
      pages: Math.ceil(gallery.files.length / limit)
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
  Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
    if (err) {
      req.flash('errors', { msg: 'Não encontramos a galeria.' })
      return res.redirect('/midia');
    }
    if (!gallery) {
      req.flash('errors', { msg: 'Não encontramos a galeria.' })
      return res.redirect('/midia');
    }

    var file = gallery.files.filter((file) => {
      if (file._id == req.params.id) {
        return file;
      }
    });

    res.render('viewsdash/pages/midia', {
      title: preTitle + 'Arquivo de midia',
      pageName: 'gallery',
      newMidia: false,
      config: req.config,
      midia: file[0],
    });
  });
}

exports.postNewMidia = (req, res) => {
  if (req.files.fileUpdate.originalFilename != '') {
  cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
    {
      resource_type: "auto",
      public_id: "galeria/"+req.files.fileUpdate.name
    },
    function(err, returnFileUpdate) {
      if (err) {
        req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' })
        return res.redirect('/midia');
      }

      if (req.files.fileCapa) {
        cloudinary.v2.uploader.upload(req.files.fileCapa.path,
          {
            resource_type: "auto",
            public_id: "galeria/capas/"+req.files.fileCapa.name
          },
          function(err, returnFileCapa) {
            Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
              if (err) {
                req.flash('errors', { msg: 'Não encontramos a galeria.' })
                return res.redirect('/midia');
              }
              if (!gallery) {
                var newGallery = new Gallery();
                newGallery.name = 'Principal'
                newGallery.save();
                req.flash('errors', { msg: 'Não encontramos a galeria. Tente Novamente!' })
                return res.redirect('/midia');
              }

              gallery.files.push({
                url: returnFileUpdate.secure_url,
                type: returnFileUpdate.resource_type,
                name: req.body.name,
                preview: returnFileCapa.secure_url,
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
      } else {
        Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
          if (err) {
            req.flash('errors', { msg: 'Não encontramos a galeria.' })
            return res.redirect('/midia');
          }
          if (!gallery) {
            var newGallery = new Gallery();
            newGallery.name = 'Principal'
            newGallery.save();
            req.flash('errors', { msg: 'Não encontramos a galeria. Tente Novamente!' })
            return res.redirect('/midia');
          }

          gallery.files.push({
            url: returnFileUpdate.secure_url,
            type: returnFileUpdate.resource_type,
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


    });
  } else {
    Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
      if (err) {
        req.flash('errors', { msg: 'Não encontramos a galeria.' })
        return res.redirect('/midia');
      }
      if (!gallery) {
        var newGallery = new Gallery();
        newGallery.name = 'Principal'
        newGallery.save();
        req.flash('errors', { msg: 'Não encontramos a galeria. Tente Novamente!' })
        return res.redirect('/midia');
      }

      gallery.files.push({
        codeYoutube: req.body.codeYoutube,
        name: req.body.name,
        description: req.body.description,
        _role: req.body.role,
      });

      gallery.save((err, saveGallery) => {
        req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
        return res.redirect('/galleries');
      })
    });
  }

}

exports.postMidia = (req, res) => {
  if (req.files.fileUpdate.originalFilename != '') {
    cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
      {
        resource_type: "auto",
        public_id: "galeria/"+req.files.fileUpdate.name
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
            var newGallery = new Gallery();
            newGallery.name = 'Principal'
            newGallery.save();
            req.flash('errors', { msg: 'Não encontramos a galeria. Tente Novamente!' })
            return res.redirect('/midia');

          }

          if (req.files.fileCapa.originalFilename != '') {
            cloudinary.v2.uploader.upload(req.files.fileCapa.path,
              {
                resource_type: "auto",
                public_id: "galeria/capas/"+req.files.fileCapa.name
              },
              function(err, returnFileCapa) {
                gallery.files = gallery.files.map((file) => {
                  if (file._id == req.params.id) {
                    file.url = returnFileUpdate.secure_url;
                    file.type = returnFileUpdate.resource_type;
                    file.name = req.body.name;
                    file.preview = returnFileCapa.secure_url;
                    file.format = returnFileUpdate.format;
                    file.description = req.body.description;
                    file.public_id = returnFileUpdate.public_id;
                    file._role = req.body.role;
                  }
                  return file;
                });

                gallery.save((err, saveGallery) => {
                  req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
                  return res.redirect('/galleries');
                });
              }
            );
          } else {
            gallery.files = gallery.files.map((file) => {
              if (file._id == req.params.id) {
                file.codeYoutube = '';
                file.url = returnFileUpdate.secure_url;
                file.type = returnFileUpdate.resource_type;
                file.name = req.body.name;
                file.format = returnFileUpdate.format;
                file.description = req.body.description;
                file.public_id = returnFileUpdate.public_id;
                file._role = req.body.role;
              }
              return file;
            });

            gallery.save((err, saveGallery) => {
              req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
              return res.redirect('/galleries');
            });
          }
        });
      }
    );
  } else {
    Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
      if (err) {
        req.flash('errors', { msg: 'Não encontramos a galeria.' })
        return res.redirect('/midia');
      }
      if (!gallery) {
        var newGallery = new Gallery();
        newGallery.name = 'Principal'
        newGallery.save();
        req.flash('errors', { msg: 'Não encontramos a galeria. Tente Novamente!' })
        return res.redirect('/midia');
      }
      if (req.files.fileCapa.originalFilename != '') {

        cloudinary.v2.uploader.upload(req.files.fileCapa.path,
          {
            resource_type: "auto",
            public_id: "galeria/capas/"+req.files.fileCapa.name
          },
          function(err, returnFileCapa) {
            gallery.files = gallery.files.map((file) => {
              if (file._id == req.params.id) {
                file.name = req.body.name;
                file.preview = returnFileCapa.secure_url;
                file.description = req.body.description;
                file._role = req.body.role;
              }
              return file;
            });

            gallery.save((err, saveGallery) => {
              req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
              return res.redirect('/galleries');
            });
          }
        );
      } else {
        gallery.files = gallery.files.map((file) => {
          if (file._id == req.params.id) {
            file.name = req.body.name;
            file.codeYoutube = req.body.codeYoutube;
            file.description = req.body.description;
            file._role = req.body.role;
          }
          return file;
        });

        gallery.save((err, saveGallery) => {
          req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
          return res.redirect('/galleries');
        });
      }
    });
  }

}

exports.deleteMidia = (req, res) => {
  Gallery.findOne({ name: 'Principal'}).populate('files._role').exec((err, gallery) => {
    if (err) {
      req.flash('errors', { msg: 'Não encontramos a galeria.' })
      return res.redirect('/midia');
    }
    if (!gallery) {
      req.flash('errors', { msg: 'Não encontramos a galeria.' })
      return res.redirect('/midia');
    }
    var removeFile;
    gallery.files = gallery.files.filter((file) => {
      if (file._id != req.params.id) {
        return file;
      } else {
        removeFile = file
      }
    });

    cloudinary.v2.uploader.destroy(
      removeFile.public_id,
      (error, result) => {

        if(error) {
          req.flash('errors', { msg: 'Não encontramos a galeria.' })
          return res.redirect('/midia');
        }



        gallery.save((err, saveGallery) => {
          req.flash('success', { msg: 'Novo arquivo adicionado a galeria.' })
          return res.redirect('/galleries');
        });
      });

  });
}
