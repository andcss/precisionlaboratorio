const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

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
        user: 'tnavarrodesenvolvimento@gmail.com', // generated ethereal user
        pass: 'tu08686040'  // generated ethereal password
      }
  });

  const mailOptions = {
    to: 'contato@precisionlaboratorio.com.br',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Precision - Contato',
    text: req.body.messagem,
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
