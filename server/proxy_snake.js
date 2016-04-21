import Koa from 'koa';
const app = new Koa();

app.use( ctx => {
	ctx.body = 'Hello World 1245';
} );

app.listen( Conf.snakePort );

console.log( `server listen on http://127.0.0.1:${Conf.snakePort}` );