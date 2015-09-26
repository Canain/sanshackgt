import * as Docooment from 'docooment';
import {Collection, Schema, Model} from 'mongoose';

let docooment = (<any>Docooment).default;

export default class Data {
	
	db: Collection;
	user: Schema;
	users: Model<any>;
	
	constructor(uri: string, port: number, options: Docooment.AuthOptions) {
		this.db = docooment.connect(uri, port, 'sanshackgt', options);
		this.user = new docooment.Schema({}, { strict: false });
		this.users = docooment.model('User', this.user);
	}
}