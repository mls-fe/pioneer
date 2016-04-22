import {
    connect
} from 'orm';

import {
    delHsot
} from './mem_cache';

const hostData = {
    "id": {
        type: 'serial',
        key: true
    },
    "ip": String,
    "host": String,
    "ukey": String,
    "port": String
}

let conn = Promise.promisify( connect );

let getTable = cb => {
    return conn( Conf.mysql ).then( db => {
        let table = db.define( 'hostData', hostData );
        return cb( table ).then( data => {
            db.close();
            return data;
        } );
    } )
}

let readHost = filter => {
    return getTable( function ( table ) {
        let find = Promise.promisify( table.find, {
            context: table
        } );
        return find( filter );
    } )
}

let createHost = data => {
    return getTable( function ( table ) {
        let create = Promise.promisify( table.create, {
            context: table
        } );
        return create( data );
    } )
}

let updateHost = ( condition, data, isCreate ) => {
    return getTable( function ( table ) {
        let one = Promise.promisify( table.one, {
            context: table
        } );
        return one( condition ).then( updateData => {
            if ( updateData ) {
                return delHsot( data.host ).then( () => {
                    return updateData.save( data );
                } );
            } else if ( isCreate ) {
                return createHost( data );
            }
        } ).catch( err => {
            console.log( err );
        } )
    } )
}

let saveHost = ( condition, data ) => {
    return updateHost( condition, data, true )
}

export {
    readHost,
    createHost,
    updateHost,
    saveHost
}