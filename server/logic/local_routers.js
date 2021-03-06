import {
	readHost,
	updateHost,
	saveHost
} from '../common/host_data';

import {
	delHsot
} from '../common/mem_cache';


let formatStruct = ( data, code, msg ) => {
	return {
		code: code || 0,
		data: data || '',
		msg: msg || 'ok'
	}
}

export let setRouters = router => {

	router.get( '/', ( ctx, next ) => {
		ctx.body = 'what are you nong sha lei?';
	} )

	router.get( '/ip', ( ctx, next ) => {
		ctx.body = formatStruct( ctx.ip );
	} )

	router.get( '/clearDomainCache', ( ctx, next ) => {
		return delHsot( ctx.query.host ).then( () => {
			ctx.body = formatStruct();
		} )
	} )

	router.get( '/hostlist', ctx => {
		return readHost( {
			ukey: ctx.query.ukey
		} ).then( data => {
			ctx.body = formatStruct( data )
		} )
	} )

	router.get( '/host', ctx => {
		let query = ctx.query;
		let hosts = [].concat( query.host );

		if ( !query.host || !query.port || !query.ukey ) {
			return ctx.body = formatStruct( null, -1, "param lose~" );
		}

		hosts = hosts.map( item => {
			let host = `${item}.fedevot.meilishuo.com`;
			return saveHost( {
				host: host
			}, {
				host: host,
				ip: query.ip || ctx.ip,
				port: query.port,
				ukey: query.ukey
			} )
		} );

		return Promise.all( hosts ).then( data => {
			ctx.body = formatStruct( data )
		} );
	} )

	// 根据mac地址更新ip与端口
	router.get( '/update', ctx => {

		return readHost( {
			ukey: ctx.query.ukey
		} ).then( hosts => {
			let upHosts = [];

			if ( hosts.length ) {
				hosts.forEach( item => {
					upHosts.push( {
						host: item.host,
						ip: ctx.query.ip || ctx.ip,
						port: ctx.query.port || item.port
					} )
				} )

				let allUp = [];

				upHosts.forEach( item => {
					allUp.push( updateHost( {
						host: item.host
					}, item ) )
				} )

				return Promise.all( upHosts ).then( () => {
					ctx.body = formatStruct( upHosts )
				} )

			} else {
				ctx.body = formatStruct( null, -1, 'not configed' )
			}
		} )
	} )

}