import {Connection, Request, ConnectionConfig} from 'tedious';
import * as async from 'async';
import * as _ from 'lodash';

interface User {
	id: string;
	content: string;
}

export default class Data {
	
	config: ConnectionConfig;
	
	connection: Connection;
	
	constructor(host: string, user: string, pass: string) {
		this.config = {
			server: host,
			userName: user,
			password: pass,
			options: {
				encrypt: true,
				database: 'sanshackgt'
			}
		};
	}
	
	escape(data: string) {
		return data.replace(/'/g, "''");
	}
	
	strip(data: string) {
		return data.replace(/;|'|"|,/g, '');
	}
	
	connect(done: ErrorCallback) {
		this.connection = new Connection(this.config);
		
		this.connection.on('connect', (error) => {
			if (error) {
				return done(error);
			}
			
			console.log('[Server] Connected to SQL Database');
			
			this.connection.execSql(new Request('CREATE TABLE dbo.Users(id int IDENTITY(1,1) PRIMARY KEY, windowsliveId VARCHAR(MAX), firstname VARCHAR(MAX), lastname VARCHAR(MAX), budget DOUBLE PRECISION, access_token VARCHAR(MAX))', (error, rowCount, rows) => {
				if (error && error.message.indexOf('There is already an object named') == -1) {
					return done(error);
				}
				
				done();
			}));
		});
	}
	
	set(id: number, data, done: ErrorCallback) {
		let sql = 'UPDATE Users SET ';
		
		let prefix = '';
		for (let i in data) {
			sql += prefix + this.strip(i) + '=';
			let k = data[i];
			if (typeof k == 'string') {
				sql += "'" + this.escape(k) + "'";
			} else {
				sql += this.strip(k);
			}
			prefix = ',';
		}
		sql += ' WHERE id=' + id;
		
		this.connection.execSql(new Request(sql, (error, rowCount, rows) => {
			done(error);
		}));
	}
	
	retrieve(access_token: string, done: AsyncResultCallback<number>) {
		// let request = new Request('SELECT ')
	}
	
	token(windowsliveId: string, access_token: string, profile, done: AsyncResultCallback<any>) {
		let token = this.escape(access_token);
		let id = this.escape(windowsliveId);
		let firstName = this.escape(profile.name.givenName);
		let lastName = this.escape(profile.name.familyName);
		this.connection.execSql(new Request("UPDATE Users SET access_token='" + token + "' WHERE windowsliveId='" + id + "'", (error, rowCount, rows) => {
			if (error) {
				return done(error, null);
			}
			
			if (rowCount == 0) {
				this.connection.execSql(new Request("INSERT INTO Users (windowsliveId,firstname,lastname,access_token) VALUES ('" + id + "', '" + firstName + "', '" + lastName + "', '" + token + "')", (error, rowCount, rows) => {
					done(error, {
						access_token: access_token
					});
				}));
			} else {
				done(null, {
					access_token: access_token
				});
			}
		}));
	}
}