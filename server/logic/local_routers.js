import {
	readHost,
	updateHost,
	saveHost
} from '../common/host_data';

import {
	delHsot
} from '../common/mem_cache';


let getIp = ( ip ) => {
	return ip.replace( '::ffff:', '' );
}

export let setRouters = router => {

	router.get( '/', ( ctx, next ) => {
		ctx.body = 'what are you nong sha lei?';
	} )

	router.get( '/ip', ( ctx, next ) => {
		ctx.body = getIp( ctx.ip );
	} )

	router.get( '/clearDomainCache', ( ctx, next ) => {
		return delHsot( {
			host: ctx.query.host
		} ).then( () => {
			ctx.body = 'ok';
		} )
	} )

	router.get( '/ukey', ctx => {
		return readHost( {
			ukey: ctx.query.ukey
		} ).then( data => {
			ctx.body = data
		} )
	} )

	router.get( '/host', ctx => {
		let query = ctx.query;
		let hosts = [].concat( query.host );

		if ( !query.host || !query.port || !query.ukey ) {
			return ctx.body = "param lose~";
		}

		hosts = hosts.map( item => {
			let host = `${item}.fedevot.meilishuo.com`;
			return saveHost( {
				host: host
			}, {
				host: host,
				ip: getIp( ctx.ip ),
				port: query.port,
				ukey: query.ukey
			} )
		} );

		return Promise.all( hosts ).then( data => {
			ctx.body = data
		} );
	} )

	// 根据mac地址更新ip
	router.get( '/update', ctx => {

		return readHost( {
			ukey: ctx.query.ukey
		} ).then( hosts => {
			let curIp = ctx.query.ip || getIp( ctx.ip );
			let upHosts = [];

			if ( hosts.length ) {
				hosts.forEach( item => {
					if ( item.ip != curIp ) {
						upHosts.push( {
							host: item.host,
							ip: curIp,
							port: item.port
						} )
					}
				} )

				let allUp = [];

				upHosts.forEach( item => {
					allUp.push( updateHost( {
						host: item.host
					}, item ) )
				} )

				return Promise.all( upHosts ).then( () => {
					ctx.body = {
						code: 0,
						updated: upHosts
					}
				} )

			} else {
				ctx.body = {
					code: -1,
					msg: 'not configed'
				}
			}
		} )
	} )

}