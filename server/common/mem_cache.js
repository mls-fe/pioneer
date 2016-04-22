import Memcached from 'memcached';
import {
	readHost,
	createHost,
	updateHost
} from './host_data';

let memcached = new Memcached( Conf.memcached );

let memGet = Promise.promisify( memcached.get ).bind( memcached );
let memDel = Promise.promisify( memcached.del ).bind( memcached );
let memSet = Promise.promisify( memcached.set ).bind( memcached );

let prefix = 'pioneer';

let getKey = key => {
	return prefix + '_' + key.replace( /\./g, '' );
}

let getHost = key => {
	let id = getKey( key );
	return memGet( id ).then( data => {
		if ( data ) {
			return data
		} else {
			return readHost( {
				host: key
			} ).then( data => {
				let cacheData = data[ 0 ];
				return memSet( id, cacheData, Conf.memCacheTime ).then( () => {
					return cacheData;
				} )
			} )
		}
	} )
}

let delHsot = key => {
	let id = getKey( key );
	return memDel( id );
}

export {
	getHost,
	delHsot
}