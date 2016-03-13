/// <reference path="typings/node/node.d.ts"/>
///////////////////////////////////////////////////////////////////
//  Author: Jared Beach
//  Title: Tumblr Slide Show
//  Description: Node.js app for viewing your tumblr dashboard
//  as a slideshow.
//////////////////////////////////////////////////////////////////

//#region MODULES
var express = require("express"),
    cors = require('cors'),
    config = require("config"),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    app = express(),
    tumblr = require('tumblr.js'),
    util = require('util'),
    OAuth = require('oauth').OAuth,
    passport = require('passport'),
    TumblrStrategy = require('passport-tumblr').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    User = require('./User');
//#endregion

//#region GLOBAL_VARIABLES
var port = process.env.PORT || parseInt(config.get("Debug.port")), // the process.env.PORT variable is for the demo on heroku
    env = process.env.NODE_ENV || 'development', // process.env.NODE_ENV determines whether this is the heroku app
    callbackURL = env == 'development' // determines where to redirect after user authenticates with tumblr
      ? "http://localhost:"+port+"/auth/tumblr/callback"
      : "http://tumblrslideshow.herokuapp.com/auth/tumblr/callback",
    allowedDomains = ['localhost:'+port, 'http://41.media.tumblr.com'], // for cors
    request_token_url = 'http://www.tumblr.com/oauth/request_token', // for requesting tumblr access
    access_token_url = 'http://www.tumblr.com/oauth/access_token', // for requesting tumblr auth
    authorize_url = 'http://www.tumblr.com/oauth/authorize', // for requesting tumblr auth
    appKey = process.env.TUMBLR_KEY || config.get("Tumblr.appKey"), // finds your app key in the default.json file in config foler (see config readme.txt)
    appSecret = process.env.TUMBLR_SECRET || config.get("Tumblr.appSecret"); // finds your app secret in the default.json file
//#endregion

//#region MODULE_CONFIGURATIONS
// configure app
// for allowing cross domain access from tumblr. May be unneccesary
var allowCrossDomain = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
}
// Files in the public folder are served staticly
app.all('*', function (req, res, next) {
    app.use(express.static(__dirname + '/public'));
	app.use('/bower_components', express.static(process.env.PWD + '/bower_components'));
    next();
});
// Creates user sessions (not really implemented yet)
app.use(session({ secret: 'SECRET',resave:true,saveUninitialized:true }));
// For tumblr auth
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(flash());

var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});
// Makes sure user is logged in when they access a page
function loggedIn(req, res, next) {
    console.log("checking for user");
    if (typeof req._passport.session.user == 'undefined') {
        console.log("no user found. redirecting...");
        //res.redirect('/auth/tumblr');
        res.send(false);
    } else if (req._passport.session.user.isGeneric) {
        console.log("Logging out generic user and sending to login.");
        req.logout();
        res.send(false);
    }else {
		res.send(true);
    }
};
app.get("(/[^(auth)][a-zA-Z(%20)]+)+", function (req, res, next) {
    console.log(req.url.toLowerCase());
	switch(req.url.toLowerCase()) {
		case '/loggedin':
			loggedIn(req,res,next);
			break;
		default:
			console.log("sending home page indirectly");
			res.sendFile(process.env.PWD + '/public/index.html');
			break;
	}
});
console.log('callbackURL: ', callbackURL);
// config passport
// Create a user session from tumblr authentication
passport.use(new TumblrStrategy({
    consumerKey: appKey,
    consumerSecret: appSecret,
    callbackURL: callbackURL
},
    function (token, tokenSecret, profile, done) {
    console.log("profile", profile);
    User.findOrCreate({
        method: 'tumblr',
        tumblrId: profile.username,
        tumblrToken: token,
        tumblrSecret: tokenSecret
    }, function (err, user) {
        //        return done(err, user);
        if (err) return done(err);
        else {

            return done(null, user);
        }
    });
}
));

// Creates a user session from a local user and pass.
// Probably going to delete this completely and only use tumblr
// Had a mysql db, but made things messy
passport.use(new LocalStrategy(
    function (username, password, done) {
        if (password == strGenericUserPass) {
            // creates a generic user object for retrieving
            // posts of a specific tumblr user.
            var user = new User({
                isGeneric: true,
                blogName:username
            });
            return done(null, user);
        }
    }
));
//#endregion

//#region TUMBLR_CLIENT
// retrieves tumblr data
function client(user) {
    var userClient = new tumblr.Client({
        consumer_key: appKey,
        consumer_secret: appSecret,
        token: user.client,
        token_secret: user.secret
    });
    return userClient;
}
function genericClient() {
    var client = new tumblr.Client({
        consumer_key: appKey,
        consumer_secret: appSecret,
    });
    return client;
}
//#endregion

//#region PASSPORT_SERIALIZATION
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
//#endregion

//#region LOGIN_METHODS
// Makes sure user is logged in when they access a page
//#endregion

//#region REQUESTS
// Redirects to login if not logged in.
// Otherwise displays default slidehshow page
// app.get('/', loggedIn, function (req, res) {
//     console.log("logged in.");
//     res.sendFile(__dirname + '/public/index.html');
// });
// Watch slideshow for specific user profile
// app.get('/user-show', function (req, res) {
//     console.log("Doing specific user slide show");
//     var user = new User({
//         isGeneric: true,
//         blogName: req.query.blogName
//     });
//     req._passport.session.user = user;
//     res.sendFile(__dirname + '/public/index.html');
// });
// app.get('/auth/tumblr',
//     passport.authenticate('tumblr', {}));

app.get('/auth/tumblr/callback',
    passport.authenticate('tumblr', {
    failureRedirect: '/login'
}),
    function (req, res) {
    console.log("tumblr auth callback.");
    // Successful authentication, redirect home.
    if (req._passport.session.user != null) {
        res.redirect('/');
    } else {
        // user hasn't registered
        res.redirect('/login');
    }
});
// display login page
// app.get('/login', function (req, res) {
//     //    login(req, res);
//     // make sure user isn't already logged in
//     if (typeof req._passport.session.user != 'undefined') {
//         console.log("user already logged in. sending home.");
//         res.redirect('/');
//     }
//     res.sendFile(__dirname + '/public/login.html');
// });

// Called from index js. Gets tumblr user slideshow data
app.get('/tData', function (req, res) {
    var limit = req.query.postLimit;
    var offset = req.query.postOffset;
    var options = {
        limit: limit,
        offset: offset,
        type: 'photo'
    };
    console.log(options);
    var user = req._passport.session.user;
    console.log("user", user);
    if (user.isGeneric) {
        genericClient().posts(user.blogName, options, function (err, data) {
            if (err) {
                console.log("error getting user blog posts.");
                console.log(err);
            } else {
                console.log("offset", offset);
                res.send(data);
            }
        });
    }
    else {
        client(user).dashboard(options, function (err, data) {
            if (err) {
                console.log("error getting dashboard");
                console.log(err);
            } else {
                console.log("offset", offset);
                res.send(data);
            }
        });
    }
});

app.get('/tumblr-auth', function (req, res) {
    tumblrCallback(req, res);
});


app.get('/blog-info', function (req, res) {
    var user = req._passport.session.user;
    client(user).blogInfo(req.query.blogName, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

app.get('/user-info', function (req, res) {
    var user = req._passport.session.user;
    console.log("user: ", user);
    res.send(user);
});
//#endregion

//#region POSTS
app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})
);

app.post('/register', function (req, res) {
    var password = req.body.password;
    if (password == null) {
        console.log("password null. send em' back.");
        res.sendFile(__dirname + '/public/register.html?err=%20null-pass%20');
    } else {
        var user = req._passport.session.user;
        console.log("password given. Update and redirect");
        User.create({
            method: 'local',
            username: user.id,
            password: password,
            tumblrToken: user.client,
            tumblrSecret: user.secret
        }, function (err, createdUser) {
            if (err) console.log(err);
            console.log("Created user.");
            res.redirect('/');
        });
    }
});

app.post('/auth/tumblr', passport.authenticate('tumblr', {

}));

app.post('/unfollow', function (req, res) {
    console.log("unfollow query: ", req.query);
    var user = req._passport.session.user;
    client(user).unfollow(req.query.blogurl, function (err,result) {
        if (err) {
            // callback(err);
            console.log("tumblr unbscribe error");
            console.log(err);
            res.status(500).send({
                error: "Something went wrong communicating with tumblr."
            });
        }
        // callback(null,data);
        res.status(200).send({error:null});
    });
});

app.post('/follow', function (req, res) {
    console.log("follow query: ", req.query);
    var user = req._passport.session.user;
    client(user).follow(req.query.blogurl, function (err,result) {
        if (err) {
            // callback(err);
            console.log("tumblr subscribing error:");
            console.log(err);
            res.status(500).send({
                error: "Something went wrong communicating with tumblr."
            });
        }
        //callback(null,data);
        console.log("Successfully subscribed user");
        res.status(200).send({error:null});
    });
});

app.post('/like', function (req, res) {
    console.log("like query: ", req.query);
    var user = req._passport.session.user;
    client(user).like(req.query.postId, req.query.reblogKey, function (err, data) {
        if (err) {
            // callback(err);
            console.log(err);
            res.status(500).send({
                error: "Something went wrong communicating with tumblr."
            });
        }
        //callback(null,data);
        res.status(200).send(data);
    });
});

app.post('/reblog', function (req, res) {
    console.log("reblog query: ", req.query);
    var user = req._passport.session.user;
    var blogName = req.query.blogName;
    var options = {
        id: parseInt(req.query.postId),
        reblog_key: req.query.reblogKey
    };
    console.log(options);
    client(user).reblog(blogName, options, function (err, data) {
        if (err) {
            // callback(err);
            console.log(err);
            res.status(500).send({
                error: "Something went wrong communicating with tumblr."
            });
        }
        //callback(null,data);
        res.status(200).send(data);
    });
});
//#endregion
