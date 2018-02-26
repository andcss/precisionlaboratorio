const nodemailer = require('nodemailer');

exports.sendNotificationNewUser = function(url, idUser) {
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
    from: 'Precision - '+ process.env.EMAIL_CONTACT,
    subject: 'Precision - Novo Usuário Registrado',
    html: 'Um novo usuário foi registrado, acesso o link para ativar esse usuário: http://'+ url +'/user/'+idUser,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}

exports.sendNotificationNewOrder = function(url, idOrder) {
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
    from: 'Precision - '+ process.env.EMAIL_CONTACT,
    subject: 'Precision - Novo Pedido Registrado',
    html: 'Um novo predido foi registrado, acesso o link para verificar as informações: http://'+ url +'/order/'+idOrder,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}
