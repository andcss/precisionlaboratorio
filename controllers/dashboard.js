const User = require('../models/User');

/**
 * GET /
 * Home contact page.
 */
exports.getHome = (req, res) => {
  res.render('viewsdash/pages/home', {
    title: 'Precision - Laboratório de execelência'
  });
};

exports.getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      redirect('/')
    } else {
      console.log(users);
      res.render('viewsdash/pages/users', {
        title: 'Home',
        users,
      });
    }
  });

};

exports.getUser = (req, res) => {
  res.render('viewsdash/pages/user', {
    title: 'Home'
  });
};

exports.getGalleries = (req, res) => {
  res.render('viewsdash/pages/gallery', {
    title: 'Home'
  });
};

exports.getPages = (req, res) => {
  res.render('viewsdash/pages/pages', {
    title: 'Home'
  });
};

exports.getEvents = (req, res) => {
  res.render('viewsdash/pages/events', {
    title: 'Home'
  });
};

exports.getEvent = (req, res) => {
  res.render('viewsdash/pages/event', {
    title: 'Home'
  });
};
