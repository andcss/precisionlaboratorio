
const Role = require('../models/Role');

exports.getRole = (req, res) => {
  Role.findById(req.params.id).exec((err, role) => {
    if (err) {

    }
    res.render('viewsdash/pages/role', {
      config: req.config,
      newRole: false,
      role,
    });
  })

};

exports.getNewRole = (req, res) => {
  res.render('viewsdash/pages/role', {
    config: req.config,
    newRole: true,
    role: new Role(),
  });
};

exports.postRole = (req, res) => {
  Role.findById(req.params.id).exec((err, role) => {
    if (err) {

    }
    role.name = req.body.name;
    role.type = req.body.type;
    role.value = req.body.value;

    role.save((err, saveRole) => {
      if(err) {

      }
      req.flash('success', { msg: 'Alterações salvas com sucesso!' });
      res.redirect('/dashboard/config');
    });

  })
};

exports.postNewRole = (req, res) => {
  let role = new Role();

  role.name = req.body.name;
  role.value = req.body.value;
  role.type = req.body.type;

  role.save((err, newRole) => {
    if(err) {

    }
    if(!newRole) {

    }

    Config.findOne({}).populate('_roles.role').exec((err, config) => {
      if(err) {
        console.log(err.message);
      }
      if(!config) {
        console.log('configNaoEncontrada :D');
      }

      config._roles.push({ role: newRole._id });

      config.save((err, saveConfig) => {
        if(err) {

        }
        if(!newRole) {

        }
        req.flash('success', { msg: 'Alterações salvas com sucesso!' });
        return res.redirect('/dashboard/config');
      })
    })
  });
};
