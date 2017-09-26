const cloudinary = require('cloudinary');

const Order = require('../models/Order');

const preTitle = 'Precision - ';

cloudinary.config({
  cloud_name: 'dgv0w6dst',
  api_key: '543319621828891',
  api_secret: 'CFL7R37APT6tfNNqhkg6W96Z7-o',
  resource_type: 'auto',
});

exports.getOrders = (req, res) => {
  Order.find({}).exec((err, orders) => {
    if(err) {
      req.flash('error', { msg: 'Não foi possível encontrar eventos.'});
      return res.redirect('back');
    }
    res.render('viewsdash/pages/orders', {
      title: preTitle+ 'Eventos',
      pageName: 'orders',
      user: req.user,
      orders
    });
  });

};

exports.getNewOrder = (req, res) => {
  res.render('viewsdash/pages/order', {
    title: preTitle+ 'Novo Pedido',
    pageName: 'orders',
    order: new Order(),
    newOrder: true,
  });
}

exports.getOrder = (req, res) => {

}

exports.postNewOrder = (req, res) => {


}

exports.postOrder = (req, res) => {

}
