import Koa from 'koa';
const app = new Koa();

app.use( ctx => {
	ctx.body = 'Hello World 1236';
} );

app.listen( Conf.serverPort );

console.log( `server listen on http://127.0.0.1:${Conf.serverPort}` );