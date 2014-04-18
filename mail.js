var nodemailer = require( "nodemailer" );
var fs = require( 'fs' );
var hogan = require('hogan.js');
var mutex = require("./mutex.js");
var juice = require("juice");



var sensitiveInfo;
var inkCSS;
var emailLayout;

var fileMutex = new mutex.Mutex(3, function() {
    
    var smtpTransport = nodemailer.createTransport( "SMTP", {
        service: "Gmail",
        auth: {
            user: "webtopss@gmail.com",
            pass: sensitiveInfo
        }
    });
            
    var testData = { ink: inkCSS };
    var template = hogan.compile(emailLayout);

    var stuff = template.render(testData);

    juice.juiceContent(stuff, { url: "http://test" }, function(err, html) {

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
            to: "mlwilson.mail@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world ✔", // plaintext body
            html: html // html body
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) console.log(error)
            else console.log("Message sent: " + response.message);

            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        });

    });

    
    
});

fs.readFile( './sensitiveInfo.config', 'utf8', function ( err, data ) {
    sensitiveInfo = data;
    fileMutex.decrement();
});

fs.readFile( './public/stylesheets/ink.css', 'utf8', function ( err, data ) {
    inkCSS = data;
    fileMutex.decrement();
});

fs.readFile( './basic.html', 'utf8', function ( err, data ) {
    emailLayout = data;
    fileMutex.decrement();
});



this.sendEmail = function () {
        

}