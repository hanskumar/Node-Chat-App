module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        //console.log("user loged in");
        return next();
    }
    // if they aren't redirect them to the home page
    return res.redirect('/');
}