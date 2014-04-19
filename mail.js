var nodemailer = require( "nodemailer" );
var fs = require( 'fs' );
var hogan = require('hogan.js');
var juice = require("juice");

var sensitiveInfo,
    inkCSS,
    emailLayout;


fs.readFile( './sensitiveInfo.config', 'utf8', function ( err, data ) {
    sensitiveInfo = data;
});

fs.readFile( './public/stylesheets/ink.css', 'utf8', function ( err, data ) {
    inkCSS = data;
});

fs.readFile( './emailLayout.html', 'utf8', function ( err, data ) {
    emailLayout = data;
});



this.sendEmail = function (callback) {
    var smtpTransport = nodemailer.createTransport( "SMTP", {
        service: "Gmail",
        auth: {
            user: "webtopss@gmail.com",
            pass: sensitiveInfo
        }
    });
            
    var data = { ink: inkCSS };

    //not totally sure what the url is for yet... maybe images?
    juice.juiceContent(hogan.compile(emailLayout).render(data), { url: "http://test" }, function(err, html) {

        var mailOptions = {
            from: "Michael Wilson <webtopss@gmail.com>",
            to: "mlwilson.mail@gmail.com",
            subject: "Node Monopoly",
            text: "This email cannot be viewed in plaintext",
            html: html 
        }

        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) console.log(error)
            else console.log("Message sent: " + response.message);
            smtpTransport.close();
            if (callback) callback();
        });
    });
}