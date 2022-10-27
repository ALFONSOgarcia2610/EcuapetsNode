
const helpers = {};
helpers.isAuthenticated = (req, res, next) => {
if(req.isAuthenticated()) {
    return next();
}
 req.flash('success_msg', 'No Autorizado, Primero Inicie Sesion');
 res.redirect('/users/signin');
};

module.exports = helpers;