declare module 'docooment' {
	import * as mongoose from 'mongoose';
	
	interface AuthOptions {
		masterKey: string;
	}
	
	export class Schema extends mongoose.Schema {
		
	}
	
	export function connect(uri: string, port: number, database: string, options: AuthOptions): mongoose.Connection;
	
	export function model<T extends mongoose.Document>(name: string, schema: mongoose.Schema): mongoose.Model<T>;
}