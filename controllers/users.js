const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const username = req.body.email;
    const { email, password, name, mobile, role } = req.body;
    const user = new User({ email, name, mobile, role, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      req.flash('success', `Welcome ${name.toUpperCase()} !`);
      res.redirect('/post');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
    console.log(e);
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/post';
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((e) => {});
  req.flash('success', 'Goodbye!');
  res.redirect('/');
};
