const nodemailer = require('nodemailer');


/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('pages/contact', {
    title: 'Contact',
    pageInfo: {}
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.ACCOUNT_SMTP_GMAIL, // generated ethereal user
        pass: process.env.PASS_SMTP_GMAIL  // generated ethereal password
      }
  });

  const mailOptions = {
    to: process.env.EMAIL_CONTACT,
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Precision - Contato',
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Sua mensagem foi enviar, aguarde que logo nossa equipe entrará em contato.' });
    res.redirect('/contact');
  });
};
