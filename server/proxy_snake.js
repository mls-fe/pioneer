import Koa from 'koa';
import httpProxy from './common/http_proxy';
import hosts from './common/hosts';

const app = new Koa();

app.use( async ctx => {

	if ( ctx.url == '/favicon.ico' || ctx.url == '/' ) {
		return ctx.body = 'what are you doing？';
	}

	let hostSource = ctx.headers.targetend || 'web';
	let snakeProxy = ctx.headers.snakeproxy;
	snakeProxy = JSON.parse( snakeProxy || '{}' );

	//TODO 废掉之前fake方式，新的集成mock 

	delete ctx.req.headers.targetend;
	delete ctx.req.headers.snakeproxy;
	// delete ctx.req.headers[ 'accept-encoding' ];

	let source = hosts[ hostSource ];

	if ( !source ) {
		console.log( `${source} is not configed | request:${ctx.url}` );
		return ctx.body = `${source} is not configed`;
	}

	let targetHost = source[ snakeProxy.target ];
	if ( !targetHost ) {
		targetHost = source[ '__' ].replace( '%0', snakeProxy.target );
	}

	httpProxy( {
		host: targetHost
	}, ctx );

} );

app.listen( Conf.snakePort );

console.log( `server(snake) listen on http://127.0.0.1:${Conf.snakePort}` );