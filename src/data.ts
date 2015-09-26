import * as Docooment from 'docooment';
import {Collection, Schema, Model} from 'mongoose';

let docooment = (<any>Docooment).default;

export default class Data {
	
	db: Collection;
	user: Schema;
	users: Model<any>;
	
	constructor(uri: string, port: number, database: string, options: Docooment.AuthOptions, done: ErrorCallback) {
		this.db = docooment.connect(uri, port, database, options, (error) => {
			if (error) {
				done(error);
				return;
			}
			this.user = new docooment.Schema({}, { strict: false });
			this.users = docooment.model('User', this.user);
			done();
		});
	}
}