import Koa from 'koa';
import {
	read_host
} from './common/host_data';

const app = new Koa();

app.use( async ctx => {

	var source = await read_host( {
		host: 'ygm.fedevot.meilishuo.com'
	} );

	console.log( source[ 0 ] );

	ctx.body = 'xxx'
} );

app.listen( Conf.hornbillPort );

console.log( `server listen on http://127.0.0.1:${Conf.hornbillPort}` );