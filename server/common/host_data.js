import {
    connect
} from 'orm';

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

const conn = Promise.promisify( connect );

const get_table = cb => {
    return conn( Conf.mysql ).then( db => {
        let table = db.define( 'hostData', hostData );
        return cb( table ).then( data => {
            db.close();
            return data;
        } );
    } )
}

const read_host = filter => {
    return get_table( function ( table ) {
        let find = Promise.promisify( table.find );
        return find( filter );
    } )
}

const create_host = data => {
    return get_table( function ( table ) {
        let create = Promise.promisify( table.create );
        return create( data );
    } )
}

const update_host = data => {

}

export {
    read_host,
    create_host,
    update_host
}