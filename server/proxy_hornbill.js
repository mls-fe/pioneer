import Koa from 'koa';
import httpProxy from './common/http_proxy';
import {
	getHost
} from './common/mem_cache';


const app = new Koa();

app.use( async ctx => {

	if ( ctx.url == '/favicon.ico' ) {
		return ctx.body = '';
	}

	var source = await getHost( ctx.headers.host );

	httpProxy( {
		host: source.ip,
		port: source.port
	}, ctx );

} );

app.listen( Conf.hornbillPort );

console.log( `server(hornbill) listen on http://127.0.0.1:${Conf.hornbillPort}` );