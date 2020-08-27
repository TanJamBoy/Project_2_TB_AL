const controller = (app) => {
    // Requiring path to so we can use relative routes to our HTML files
    const path = require("path");
    // Requiring our custom middleware for checking if a user is logged in
    const isAuthenticated = require("../config/middleware/isAuthenticated");
    const db = require("../models/");
    const passport = require("../config/passport");

    //html routes
    app.get("/", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        }
        res.render("signup")
    });

    app.get("/login", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        }
        res.render("login")
    });
    app.get("/game", isAuthenticated, (req, res) => {
        // If the user already has an account send them to the members page
        res.render("game")
    });
    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get("/members", isAuthenticated, (req, res) => {
        res.render("members")
    });
    //end of html routes

    //api routes
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", (req, res) => {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        })
        .then(() => {
            res.redirect(307, "/api/login");
        })
        .catch(err => {
            res.status(401).json(err);
        });
    });

    // Route for logging user out
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", (req, res) => {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });

    app.post("/api/character", (req, res) => {
        db.Character.create({
            level: req.body.level,
            x_position: req.body.x_position,
            y_position: req.body.y_position,
            UserId: req.body.UserId
        });
    });

    app.put("/api/character/:UserId", (req, res) => {
        let id = req.body.UserId;
        db.Character.update({
            level: req.body.level,
            x_position: req.body.x_position,
            y_position: req.body.y_position,
            UserId: req.body.UserId
        },{
            where:{UserId: id}
        })
    });

    app.get("/api/character/:UserId", (req, res) => {
        let id = req.params.UserId;
        db.Character.findOne({ where: {UserId: id} }).then(data => {
            res.json(data);
        })
    });
    //end of api routes
};
module.exports = controller;