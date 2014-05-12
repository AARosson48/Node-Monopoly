// Setup all modules
express = require( 'express' ),
http = require( 'http' ),
path = require( 'path' ),
fs = require( 'fs' );
nodemailer = require( 'nodemailer' ),
hogan = require( 'hogan.js' ),
mongoose = require( 'mongoose' ),
juice = require( "juice" ),
mutex = require( "./mutex.js" ),
mail = require( './mail' ),
gameboardModel = require( "./models/gameboardModel" ),
playerModel = require( "./models/playerModel" ),
cardModel = require( "./models/cardModel" ),
turnMechanics = require( "./turnMechanics" ),
chanceAndChestMechanics = require( './chanceAndChestMechanics.js' ),
rentCalculations = require( './rentCalculations.js' );
gameAreaManager = require( './gameAreaManager.js' );
testing = require( './testing.js' );

app = module.exports = express();

// All environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hjs' );
app.use( express.favicon() );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.methodOverride() );
app.use( app.router );
// app.use(require('less-middleware')(path.join(__dirname, 'public')));  // ntvs stuggles to compile the less-middleware, just use winless as needed or a patch is released
app.use( express.static( path.join( __dirname, 'public' ) ) );

// development only
if ( 'development' == app.get( 'env' ) ) {
    app.use( express.errorHandler() );
    app.use( express.logger( 'dev' ) );
}

// Setup mongo connection
mongoose.connect( "mongodb://localhost/MongoTest" );

// Init all routes
routes = require( './routes' );  // Actually inits the index. any more, and it will need to be initialized

// Consider getting the gamebaord now and caching
// DONE
gameAreaManager.populateGameAreas();

// Get sensitive info ready
fs.readFile( './sensitiveInfo.config', 'utf8', function ( err, data ) {
    if ( err ) console.log( "we couldn't read our configs" );
    sensitiveInfo = data;
});

http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
});
