const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {// loga o usuário após ele se registrar, porém deve haver um error randling nessa função
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!!');
    //quando pedir para alterar algo ou adicionar quando nao logado, após logar sera direcionado de volta para a pagina q solicitou a alteração. ccaso va direto para login, será redirecionado para camp grounds
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}; 

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbyeeeee')
    res.redirect('/campgrounds');
};