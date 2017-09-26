const cloudinary = require('cloudinary');

const Event = require('../models/Event');

const preTitle = 'Precision - ';

cloudinary.config({
  cloud_name: 'dgv0w6dst',
  api_key: '543319621828891',
  api_secret: 'CFL7R37APT6tfNNqhkg6W96Z7-o',
  resource_type: 'auto',
});

exports.getEvents = (req, res) => {
  Event.find({}).exec((err, events) => {
    if(err) {
      req.flash('error', { msg: 'Não foi possível encontrar eventos.'});
      return res.redirect('back');
    }
    res.render('viewsdash/pages/events', {
      title: preTitle+ 'Eventos',
      pageName: 'events',
      user: req.user,
      events
    });
  });

};

exports.getNewEvent = (req, res) => {
  res.render('viewsdash/pages/event', {
    title: preTitle+ 'Eventos',
    pageName: 'events',
    user: req.user,
    event: new Event(),
    newEvent: true,
  });
}

exports.getEvent = (req, res) => {

}

exports.postNewEvent = (req, res) => {

}

exports.postEvent = (req, res) => {

}
