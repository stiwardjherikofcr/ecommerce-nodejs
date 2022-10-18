module.exports = {
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Not Authorized.");
        return res.redirect('/auth/signin');
    },

    isNotAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/products/products_list');
    },

    authorizedRole(role) {
        return (req, res, next) => {
            if (req.user.id_role === role) {
                return next();
            }
            req.flash("error", "Not Authorized.");
            return res.redirect('/auth/signin');
        }
    }
};