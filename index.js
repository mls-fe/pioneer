require( 'babel-core/register' );

global.Conf = require( './conf' ).conf;
global.Promise = require( "bluebird" );

const cluster = require( 'cluster' );
const os = require( 'os' );
const cpus = Conf.cupNums || os.cpus().length;

if ( cluster.isMaster ) {

	[ './server/proxy_hornbill', './server/proxy_snake', './server/local_server' ].forEach( filename => {
		var env = {
			filename
		};
		for ( var i = cpus; i--; ) {
			cluster.fork( env )._env = env;
		}
	} );

	cluster.on( 'exit', worker => {
		console.log( `worker ${worker.process.pid} ('${worker._env.filename}') died at: ${new Date}` );
		cluster.fork( worker._env )._env = worker._env;
	} );

} else {
	require( process.env.filename );
}