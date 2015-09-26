/// <reference path="../typings/tsd.d.ts" />

declare module 'doqmentdb' {
	import * as DocumentDB from 'documentdb';
	
	export default class DoQmentDB {
		
		/**
		* DoQmentDB constructor get connection object and
		* database as a string
		*/
		constructor(conn: DocumentDB.DocumentClient, dbName: string);
		
		/**
		* get collection name and return CollectionManager instance.
		* if the given `collection` is not exist it will create one.
		*/
		use(collName: string): Collection;
	}
	
	interface SchemaField {
		type;
		default?;
		regex?: string;
		error?: string;
		expose?: boolean;
	}
	
	interface Schema {
		(attribute: string): SchemaField;
	}
	
	class Collection {
		
		/**
		* Collection constructor called gets from DoQmentDB.use()
		*/
		constructor(conn, db, coll);
		
		/**
		 * initialize schema service
		 */
		schema(schema: Schema);
		
		/**
		* get object properties to search, find the equivalents
		* and modify them.
		*/
		findAndModify(sDoc, nDoc): any;
		
		/**
		* get object properties to search, find the equivalents
		* and modify them.
		*/
		update(sDoc, nDoc): any;
	}
}