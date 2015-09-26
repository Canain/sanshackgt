import {DocumentClient, DatabaseMeta, CollectionMeta} from 'documentdb';
import * as async from 'async';

interface User {
	id: string;
	content: string;
}

export default class Data {
	
	auth: {
		host: string;
		key: string;
	};
	
	client: DocumentClient;
	
	constructor(host: string, key: string) {
		this.auth = {
			host: host,
			key: key
		};
		
		
		// this.db = docooment.connect(uri, port, database, options, (error) => {
		// 	if (error) {
		// 		done(error);
		// 		return;
		// 	}
		// 	this.user = new docooment.Schema({}, { strict: false });
		// 	this.users = docooment.model('User', this.user);
		// 	done();
		// });
	}
	
	connect(done: ErrorCallback) {
		this.client = new DocumentClient(this.auth.host, {
			masterKey: this.auth.host
		});
		
		async.waterfall([
			(next) => {
				this.client.createDatabase({ id: 'sanshackgt' }, {}, next);
			}, (database: DatabaseMeta, next) => {
				console.log('Created DB');
				this.client.createCollection(database._self, { id: 'users' }, {}, next);
			}, (collection: CollectionMeta, next) => {
				console.log('Created Collection');
				this.client.createDocument(collection._self, <any>{ id: 'test', content: 'Shuyang Chen' }, {}, next);
			}
		], (error, result) => {
			if (error) {
				done(error);
			} else {
				console.log('Created Document');
				done();
			}
		});
	}
}