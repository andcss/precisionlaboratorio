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
  Event.findById(req.params.id, (err, findEvent) => {
    if (err) {
      req.flash('errors', { msg: 'Não foi possivel carregar o evento.' });
      return res.redirect('/events');
    }

    res.render('viewsdash/pages/event', {
      title: preTitle+ 'Eventos',
      pageName: 'events',
      user: req.user,
      event: findEvent,
      newEvent: false,
    });

  })
}

exports.postNewEvent = (req, res) => {

  var newEvent = new Event({
    name: req.body.name,
    startDate: Date(req.body.startDate),
    endDate: Date(req.body.endDate),
    description: req.body.description
  });

  newEvent.save((err, saveEvent) => {
    if (err) {
      req.flash('errors', { msg: 'Um erro aconteceu no cadastro do evento.' });
      return res.redirect('/events');
    }
    if (req.files) {
      cloudinary.v2.uploader.upload(req.files.fileUpdate.path,
        {
          resource_type: "auto"
        },
        function(err, returnFileUpdate) {
          if (err) {
            req.flash('errors', { msg: 'Um erro aconteceu no upload de arquivo.' });
            return res.redirect('/events');
          }

          saveEvent.url_image = returnFileUpdate.secure_url;

          saveEvent.save((err, saveEvent) => {
            if(err) {
              return;
            }
            req.flash('success', { msg: 'Novo evento criado' });
            return res.redirect('/events');
          })
        }
      );
    }
    req.flash('success', { msg: 'Evento cadastrado com sucesso!' });
    return res.redirect('/events');
  });


}

exports.postEvent = (req, res) => {

}
