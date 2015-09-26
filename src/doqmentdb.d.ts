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
	
	class Collection {
		
		/**
		* Collection constructor called gets from DoQmentDB.use()
		*/
		constructor(conn, db, coll);
	}
}