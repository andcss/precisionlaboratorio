const cloudinary = require('./cloudinary');
const moment = require('moment');

const Order = require('../models/Order');
const Material = require('../models/Material');

const preTitle = 'Precision - ';

function getMaterials() {
  return new Promise((result, reject) => {
    Material.find({}, (err, materials) => {
      if (err) {
        reject();
      }
      result(materials);
    });
  });
}

exports.getOrders = (req, res) => {

  var queryWhere = {}
  if (req.user._role.value < 9) {
    queryWhere = { user: req.user._id }
  }
  Order.find(queryWhere).populate('user').sort({createdAt: -1}).exec((err, orders) => {
    if(err) {
      req.flash('error', { msg: 'Não foi possível encontrar eventos.'});
      return res.redirect('back');
    }

    orders = orders.filter((order) => {
      if (order.user.email)
        return order;
    });

    res.render('viewsdash/pages/orders', {
      title: preTitle+ 'Eventos',
      pageName: 'orders',
      user: req.user,
      orders
    });
  });

};


exports.getNewOrder = (req, res, next) => {

  getMaterials().then((materials) => {
    res.render('viewsdash/pages/order', {
      title: preTitle+ 'Novo Pedido',
      pageName: 'orders',
      order: new Order(),
      newOrder: true,
      materials,
    });
  });

}

exports.getOrder = (req, res) => {
  getMaterials().then((materials) => {

    Order.findById(req.params.id)

      .populate('user').exec((err, findOrder) => {
        if (err) {
          req.flash('errors', { msg: 'Erro ao buscar informações do pedido' });
          return res.redirect('back');
        }
        res.render('viewsdash/pages/order', {
          title: preTitle+ 'Editar Pedido',
          pageName: 'orders',
          order: findOrder,
          newOrder: false,
          materials,
        });
    });
  });
}

exports.postNewOrder = (req, res) => {

  var selectedTeeth = req.body.selectedTeeth || [];
  var photosFiles = {};

  var promisesFiles = [];
  //return res.json(req.files)

  for (var key in req.files) {
    if (req.files[key].originalFilename) {
      promisesFiles.push(new Promise((resolve, reject) => {
        var fileIndex = key;
        cloudinary.v2.uploader.upload(req.files[fileIndex].path,
          {
            resource_type: "auto",
            public_id: req.user.profile.firstName + req.user.ufCro + req.user.cro + "/paciente/" + req.body.name + "/" + req.files[fileIndex].name
          },
          function(err, returnFileUpdate) {
              if(err)
                reject(err);
              else {
                photosFiles[fileIndex] = {
                  url_image: returnFileUpdate.secure_url,
                  public_id: returnFileUpdate.public_id,
                }
                resolve();
              }
          });
      }));

    } else {
      photosFiles[key] = {
        url_image: '',
        public_id: '',
      }
    }
  }

  Promise.all(promisesFiles).then(() => {
    var newOrder = new Order({
      user: req.user._id,
      status: req.body.rascunho == 'true' ? 'Rascunho' : 'Enviado',
      patient: {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
      },
      domainColor: req.body.domainColor,
      remainingColor: req.body.remainingColor,
      usedScale: req.body.usedScale,
      orderInfos: {
        note: req.body.note,
        implat: req.body.implat,
        model: req.body.model,
        diameter: req.body.diameter,

      },
      selectedTeeth: {
        t1: selectedTeeth.indexOf('t1') > -1,
        t2: selectedTeeth.indexOf('t2') > -1,
        t3: selectedTeeth.indexOf('t3') > -1,
        t4: selectedTeeth.indexOf('t4') > -1,
        t5: selectedTeeth.indexOf('t5') > -1,
        t6: selectedTeeth.indexOf('t6') > -1,
        t7: selectedTeeth.indexOf('t7') > -1,
        t8: selectedTeeth.indexOf('t8') > -1,
        t9: selectedTeeth.indexOf('t9') > -1,
        t10: selectedTeeth.indexOf('t10') > -1,
        t11: selectedTeeth.indexOf('t11') > -1,
        t12: selectedTeeth.indexOf('t12') > -1,
        t13: selectedTeeth.indexOf('t13') > -1,
        t14: selectedTeeth.indexOf('t14') > -1,
        t15: selectedTeeth.indexOf('t15') > -1,
        t16: selectedTeeth.indexOf('t16') > -1,
        t17: selectedTeeth.indexOf('t17') > -1,
        t18: selectedTeeth.indexOf('t18') > -1,
        t19: selectedTeeth.indexOf('t19') > -1,
        t20: selectedTeeth.indexOf('t20') > -1,
        t21: selectedTeeth.indexOf('t21') > -1,
        t22: selectedTeeth.indexOf('t22') > -1,
        t23: selectedTeeth.indexOf('t23') > -1,
        t24: selectedTeeth.indexOf('t24') > -1,
        t25: selectedTeeth.indexOf('t25') > -1,
        t26: selectedTeeth.indexOf('t26') > -1,
        t27: selectedTeeth.indexOf('t27') > -1,
        t28: selectedTeeth.indexOf('t28') > -1,
        t29: selectedTeeth.indexOf('t29') > -1,
        t30: selectedTeeth.indexOf('t30') > -1,
        t31: selectedTeeth.indexOf('t31') > -1,
        t32: selectedTeeth.indexOf('t32') > -1,
      },
      materials: req.body.materials,
      othersMaterials: req.body.othersMaterials,
      options: {
        blade: req.body.blade,
        qtdBlade: req.body.qtdBlade,
        crown: req.body.crown,
        qtdCrown: req.body.qtdCrown,
        inlay: req.body.inlay,
        qtdInlay: req.body.qtdInlay,
      },
      photos: photosFiles
    });

    newOrder.save((err, saveOrder) => {
        if (err) {
          req.flash('errors', { msg: 'Erro ao salvar perdido' });
          return res.redirect('back');
        }
        res.redirect('/orders');
    });
  })

}

exports.postOrder = (req, res) => {
  Order.findById(req.params.id).exec((err, findOrder) => {
    if (err) {
      req.flash('errors', { msg: 'Erro ao salvar perdido' });
      return res.redirect('back');
    }

    var photosFiles = {};

    var promisesFiles = [];
    //return res.json(req.files)

    for (var key in req.files) {
      if (req.files[key].originalFilename) {
        promisesFiles.push(new Promise((resolve, reject) => {
          var fileIndex = key;
          cloudinary.v2.uploader.upload(req.files[fileIndex].path,
            {
              resource_type: "auto",
              public_id: req.user.profile.firstName + req.user.ufCro + req.user.cro + "/paciente/" + req.body.name + "/" + req.files[fileIndex].name
            },
            function(err, returnFileUpdate) {
                if(err)
                  reject(err);
                else {
                  photosFiles[fileIndex] = {
                    url_image: returnFileUpdate.secure_url,
                    public_id: returnFileUpdate.public_id,
                  }
                  resolve();
                }
            });
        }));

      } else {
        photosFiles[key] = {
          url_image: findOrder.photos[key].url_image,
          public_id: findOrder.photos[key].public_id,
        }
      }
    }

    Promise.all(promisesFiles).then(() => {
      var selectedTeeth = req.body.selectedTeeth || [];

      findOrder.patient = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
      };
      if (req.body.rascunho == 'true'){
        findOrder.status = 'Rascunho';
      } else {
        findOrder.status = req.body.status || 'Enviado';
      }
      findOrder.domainColor = req.body.domainColor;
      findOrder.remainingColor = req.body.remainingColor;
      findOrder.usedScale = req.body.usedScale;
      findOrder.orderInfos = {
        note: req.body.note,
        implat: req.body.implat,
        model: req.body.model,
        diameter: req.body.diameter,
      };

      if(req.body.previewDate) {
        findOrder.orderInfos.previewDate = new Date(moment(req.body.previewDate, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm"));
      }

      findOrder.selectedTeeth = {
        t1: selectedTeeth.indexOf('t1') > -1,
        t2: selectedTeeth.indexOf('t2') > -1,
        t3: selectedTeeth.indexOf('t3') > -1,
        t4: selectedTeeth.indexOf('t4') > -1,
        t5: selectedTeeth.indexOf('t5') > -1,
        t6: selectedTeeth.indexOf('t6') > -1,
        t7: selectedTeeth.indexOf('t7') > -1,
        t8: selectedTeeth.indexOf('t8') > -1,
        t9: selectedTeeth.indexOf('t9') > -1,
        t10: selectedTeeth.indexOf('t10') > -1,
        t11: selectedTeeth.indexOf('t11') > -1,
        t12: selectedTeeth.indexOf('t12') > -1,
        t13: selectedTeeth.indexOf('t13') > -1,
        t14: selectedTeeth.indexOf('t14') > -1,
        t15: selectedTeeth.indexOf('t15') > -1,
        t16: selectedTeeth.indexOf('t16') > -1,
        t17: selectedTeeth.indexOf('t17') > -1,
        t18: selectedTeeth.indexOf('t18') > -1,
        t19: selectedTeeth.indexOf('t19') > -1,
        t20: selectedTeeth.indexOf('t20') > -1,
        t21: selectedTeeth.indexOf('t21') > -1,
        t22: selectedTeeth.indexOf('t22') > -1,
        t23: selectedTeeth.indexOf('t23') > -1,
        t24: selectedTeeth.indexOf('t24') > -1,
        t25: selectedTeeth.indexOf('t25') > -1,
        t26: selectedTeeth.indexOf('t26') > -1,
        t27: selectedTeeth.indexOf('t27') > -1,
        t28: selectedTeeth.indexOf('t28') > -1,
        t29: selectedTeeth.indexOf('t29') > -1,
        t30: selectedTeeth.indexOf('t30') > -1,
        t31: selectedTeeth.indexOf('t31') > -1,
        t32: selectedTeeth.indexOf('t32') > -1,
      };
      findOrder.materials = req.body.materials;
      findOrder.othersMaterials = req.body.othersMaterials;
      findOrder.options = {
        blade: req.body.blade,
        qtdBlade: req.body.qtdBlade,
        crown: req.body.crown,
        qtdCrown: req.body.qtdCrown,
        inlay: req.body.inlay,
        qtdInlay: req.body.qtdInlay,
      };
      findOrder.photos = photosFiles;

      findOrder.save((err, saveOrder) => {
        if (err) {
          req.flash('errors', { msg: 'Erro ao salvar perdido' });
          return res.redirect('back');
        }
        res.redirect('/orders');
      });
    });
  });

}
