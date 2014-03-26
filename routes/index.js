var app = require("../app");
var db = require("../db");
var nodemailer = require('nodemailer');
var mail = require("nodemailer").mail;


var User = mongoose.model('User', {
	name: String,
    color: String
});


app.get('/', function(req, res) {
	User.find(function(err, currUsers) {
		if (err) return console.log("failed to get users");
        
  	    res.render('index', { 
  		    title: 'Node Monopoly',
  		    users: currUsers,
  	    });
	});
});

app.get('/newuser', function(req, res) {
     var newuser = new User({
	 	name: "Mike"
	 });

	 newuser.save(function(err) {
	 	if (err) console.log("error in saving the user");
            res.render('user', { 
  		        title: 'Node Monopoly'
  	    });
	 });
});

app.get('/newmail', function(req, res) {

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
        auth: {
            user: "ircaej",
            pass: "VsyViyo[22",
            doamin: "corp"
        },
        domain: "corp",
        debug: true,
        secureConnection: true,
        host: "webmail.irco.com",
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Michael Wilson <michael.wilson@trane.com>", // sender address
        to: "nightmarecinemajesty@gmail.com", // list of receivers
        subject: "Hello ?", // Subject line
        text: "Hello world ?", // plaintext body
        html: "<b>Hello world ?</b>" // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
});