import http from 'http';

let httpProxy = ( source, ctx ) => {

	ctx.respond = false;

	let thisReq = ctx.req;
	let thisRes = ctx.res;

	let request_timer;
	let backTimeoutTTL = 20000;
	let options = {
		host: source.ip,
		port: source.port || 80,
		headers: thisReq.headers,
		path: thisReq.url,
		method: thisReq.method
	};

	let httpRequest = http.request( options, response => {
		if ( request_timer ) clearTimeout( request_timer )
		thisRes.writeHead( response.statusCode, response.headers )
		response.setEncoding( 'utf8' )
		response.pipe( thisRes )
	} ).on( 'error', e => {
		thisRes.end( 'error happend at :[' + thisReq.headers.host + thisReq.url + ']' + e )
	} );

	request_timer = setTimeout( () => {
		let now_time = new Date()
		let err_time = now_time.toLocaleTimeString() + ' ' + now_time.toLocaleDateString();
		console.log( 'request timeout [%s] %s' + err_time, thisReq.headers.host, thisReq.url );

		httpRequest.abort();
		thisRes.end( 'request timeout :' + thisReq.url );
	}, backTimeoutTTL );

	thisReq.pipe( httpRequest )
}

export default httpProxy;