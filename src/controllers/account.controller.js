const accountController = {};

accountController.profile = (req, res) => {
    res.render("account/profile");
};

module.exports = accountController;