/**
 * GET /
 * Home contact page.
 */
exports.getHome = (req, res) => {
  res.render('viewsdash/pages/home', {
    title: 'Home'
  });
};
