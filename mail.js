var inkCSS,
    emailLayout,
    emailBody;

fs.readFile( './public/stylesheets/ink.css', 'utf8', function ( err, data ) {
    if (err) console.log("we couldnt' read the ink css");
    inkCSS = data;
});

fs.readFile( './views/emailLayout.hjs', 'utf8', function ( err, data ) {
    if (err) console.log("we couldnt' read the email Layout");
    emailLayout = data;
});

fs.readFile( './views/emailBody.hjs', 'utf8', function ( err, data ) {
    if (err) console.log("we couldnt' read the email body");
    emailBody = data;
});


var smtpTransport = nodemailer.createTransport( "SMTP", {
    service: "Gmail",
    auth: {
        user: "webtopss@gmail.com",
        pass: "Top$$0000"
    }
});

this.sendEmail = function (body, callback) {

    
    var mailOptions = {
        from: "webtopss@gmail.com",
        to: "weisse.simon@gmail.com",
        subject: "Node Monopoly",
        text: "This email cannot be viewed in plaintext",
        html: body
    }

        smtpTransport.sendMail( mailOptions, function ( err, response ) {
        if ( err ) console.log( error )
            else console.log( "Message sent: " + response.message );
        smtpTransport.close();
        if ( callback ) callback();
    });
            
    //var data = { 
    //    ink: inkCSS,
    //    body: emailBody
    //};

    ////not totally sure what the url is for yet... maybe images?
    //juice.juiceContent(hogan.compile(emailLayout).render(data), { url: "http://test" }, function(err, html) {

    //    var mailOptions = {
    //        from: "Michael Wilson <webtopss@gmail.com>",
    //        to: "mlwilson.mail@gmail.com",
    //        subject: "Node Monopoly",
    //        text: "This email cannot be viewed in plaintext",
    //        html: html 
    //    }

    //    smtpTransport.sendMail(mailOptions, function (err, response) {
    //        if (err) console.log(error)
    //        else console.log("Message sent: " + response.message);
    //        smtpTransport.close();
    //        if (callback) callback();
    //    });
    //});
}