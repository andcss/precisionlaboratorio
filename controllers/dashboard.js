/**
 * GET /
 * Home contact page.
 */
exports.getHome = (req, res) => {
  res.render('viewsdash/pages/home', {
    title: 'Home'
  });
};

exports.getUsers = (req, res) => {
  res.render('viewsdash/pages/users', {
    title: 'Home'
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
