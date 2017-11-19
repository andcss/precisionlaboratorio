
const moment = require('moment');

const Event = require('../models/Event');

const preTitle = 'Precision - ';

const cloudinary = require('./cloudinary');

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
}

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
  });
}

exports.postNewEvent = (req, res) => {
  var newEvent = new Event({
    name: req.body.name,
    startDate: new Date(moment(req.body.startDate, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm")),
    endDate: new Date(moment(req.body.endDate, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm")),
    description: req.body.description,
    featured: req.body.featured ? true : false,
  });

  newEvent.save((err, saveEvent) => {
    if (err) {
      req.flash('errors', { msg: 'Um erro aconteceu no cadastro do evento.' });
      return res.redirect('/events');
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

          saveEvent.url_image = returnFileUpdate.secure_url;

          saveEvent.save((err, saveEvent) => {
            if(err) {
              req.flash('error', { msg: 'Não foi possivel salvar o evento' });
              return res.redirect('/event');
            }
            req.flash('success', { msg: 'Novo evento criado' });
            return res.redirect('/events');
          })
        }
      );
    } else {
      req.flash('success', { msg: 'Evento cadastrado com sucesso!' });
      return res.redirect('/events');
    }
  });
}

exports.postEvent = (req, res) => {
  Event.findById(req.params.id).exec((err, findEvent) => {
    if (err) {
      req.flash('error', { msg: 'Não foi possivel salvar o evento' });
      return res.redirect('/event');
    }

    findEvent.name = req.body.name;
    findEvent.startDate = new Date(moment(req.body.startDate, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm"));
    findEvent.endDate = new Date(moment(req.body.endDate, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm"));
    findEvent.description = req.body.description;
    findEvent.featured = req.body.featured ? true : false;

    findEvent.save((err, saveEvent) => {
      if (err) {
        req.flash('error', { msg: 'Não foi possivel salvar o evento' });
        return res.redirect('back');
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

            saveEvent.url_image = returnFileUpdate.secure_url;

            saveEvent.save((err, saveEvent) => {
              if(err) {
                req.flash('error', { msg: 'Não foi possivel salvar o evento' });
                return res.redirect('/event');
              }
              req.flash('success', { msg: 'Evento Alterado com sucesso!' });
              return res.redirect('/events');
            })
          }
        );
      } else {
        req.flash('success', { msg: 'Evento Alterado com sucesso!' });
        return res.redirect('/events');
      }
    });
  });
}

exports.deleteEvent = (req, res) => {
  Event.findById(req.params.id, (err, findEvent) => {
    if (err) {
      req.flash('errors', { msg: 'Não foi possivel carregar o evento.' });
      return res.redirect('/events');
    }
    findEvent.remove((err) => {
      return res.redirect('/events');
    })

  });
}

exports.getNextEvents = (req, res) => {
  // filter date now
  // $and: [
  //    { startDate: { $gt: Date.now() } }
  //  ]
  Event.find({}).sort({startDate: 1}).exec((err, findEvents) => {
    if (err) {
      return res.status(400).json({ msg: 'Erro na busca de Eventos' });
    }
    return res.json(findEvents);
  });
}
