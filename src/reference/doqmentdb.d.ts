/// <reference path="../typings/tsd.d.ts" />

declare module 'doqmentdb' {
	import * as DocumentDB from 'documentdb';
	import * as Promise from 'bluebird';
	
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
		findAndModify(sDoc, nDoc): Promise<any>;
		
		/**
		* get object properties to search, find the equivalents
		* and modify them.
		*/
		update(sDoc, nDoc): Promise<any>;
		
		/**
		 * get object properties and modify the first matching.
		 */
		findOneAndModify(sDoc, nDoc): Promise<any>;
		
		/**
		 * get object properties and modify the first matching.
		 */
		updateOne(sDoc, nDoc): Promise<any>;
	}
}