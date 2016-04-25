import Koa from 'koa';
import Router from 'koa-router';
import {
	setRouters
} from './logic/local_routers';

const app = new Koa();
const router = Router();

setRouters( router );

app.proxy = true;

app
	.use( router.routes() )
	.use( router.allowedMethods() );

app.listen( Conf.serverPort );

console.log( `server(local) listen on http://127.0.0.1:${Conf.serverPort}` );