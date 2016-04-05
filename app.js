var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");



var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"Krystal is too cool",
    resave: false,
    saveUninitialized: false
}));

// need both of these for passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// these are responsible for reading data from the session and unencoding it and then encoding to put it back(these are from passport local mongoose)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =========ROUTES=============


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
    res.render("secret");
});

// AUTH ROUTES

app.get("/register", function(req, res){
    res.render("register");
});
// handling user signup
app.post("/register", function(req, res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render('register');
      } 
          passport.authenticate("local")(req, res, function(){
              res.redirect("/secret");
          });
      }
   );
});

// LOGIN ROUTES
// render login form
app.get("/login", function(req, res){
    res.render("login");
});
// Login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
        
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});