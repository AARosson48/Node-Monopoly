var app = require("../app");
var gameboardModels = require("../models/gameboardModel");
var playerModels = require("../models/playerModel");
var turnMechanics = require("./../turnMechanics");

var gameboard;

app.get('/', function(req, res) {
    var players;
    var gameboardMutexDecrement = function() {
        if (players && gameboard) {
            res.render('gameBoard', { 
  		        title: 'Node Monopoly',
  		        gameAreas: gameboard.reduce(function(prevGameAreas, currGameArea) {
                    prevGameAreas.push({
                        name: currGameArea.name,
                        index: currGameArea.index,
                        value: currGameArea.value,
                        image: currGameArea.image,
                        color: currGameArea.color,
                        players: players.reduce(function(prevPlayers, currPlayer) {
                            //return all players currently on this current game area
                            if (currPlayer.currentGameArea == currGameArea.index) {
                                prevPlayers.push({
                                    name: currPlayer.name,
                                    money: currPlayer.money    
                                });
                            }
                            return prevPlayers;
                        },[])
                    });
                    return prevGameAreas;
                }, [])
  	        });
        }
    };

    playerModels.Player.find(function(err, data) {
        if (err) return console.log("failed to get players");
        players = data;
        gameboardMutexDecrement();
    });

    if (!gameboard) {
        gameboardModels.GameArea.find(function(err, data) {
		    if (err) return console.log("failed to get game areas");

            data.sort(function(a, b) { 
                return a.boardLocation - b.boardLocation; 
            });

            gameboard = data;
            gameboardMutexDecrement();
	    }); 
     }
});

app.get('/taketurn', function(req, res) {
    turnMechanics.takeTurnStep(function(data) {
        return res.send(data);
    })
});

app.get('/resetGame', function(req, res) {
    turnMechanics.resetGame(function() {
        
        });
});



//app.get('/', function(req, res) {
//	User.find(function(err, currUsers) {
//		if (err) return console.log("failed to get users");
        
//  	    res.render('index', { 
//  		    title: 'Node Monopoly',
//  		    users: currUsers,
//  	    });
//	});
//});

//app.get('/newuser', function(req, res) {
//     var newuser = new User({
//	 	name: "Mike"
//	 });

//	 newuser.save(function(err) {
//	 	if (err) console.log("error in saving the user");
//            res.render('user', { 
//  		        title: 'Node Monopoly'
//  	    });
//	 });
//});

//app.get('/newmail', function(req, res) {

//    // create reusable transport method (opens pool of SMTP connections)
//    var smtpTransport = nodemailer.createTransport("SMTP",{
//        auth: {
//            user: "ircaej",
//            doamin: "corp"
//        },
//        domain: "corp",
//        debug: true,
//        secureConnection: true,
//        host: "webmail.irco.com",
//    });

//    // setup e-mail data with unicode symbols
//    var mailOptions = {
//        from: "Michael Wilson <michael.wilson@trane.com>", // sender address
//        to: "nightmarecinemajesty@gmail.com", // list of receivers
//        subject: "Hello ?", // Subject line
//        text: "Hello world ?", // plaintext body
//        html: "<b>Hello world ?</b>" // html body
//    }

//    // send mail with defined transport object
//    smtpTransport.sendMail(mailOptions, function(error, response){
//        if(error){
//            console.log(error);
//        }else{
//            console.log("Message sent: " + response.message);
//        }

//        // if you don't want to use this transport object anymore, uncomment following line
//        //smtpTransport.close(); // shut down the connection pool, no more messages
//    });
//});