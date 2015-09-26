/// <reference path="reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';

export default class Server {
	
	app: Express;
	
	constructor(public port: number) {
		this.app = (<any>express).default();
		
		this.app.use(express.static(process.cwd() + '/pub'));
		
		this.app.use(bodyParser.json());
		
		this.app.post('/index', this.index.bind(this));
	}
	
	index(req: Request, res: Response) {
		res.json({
			success: true,
			data: req.body
		});
	}
	
	listen() {
		this.app.listen(this.port, () => {
			console.log('[Server] Listening on port ' + this.port);
		});
	}
}