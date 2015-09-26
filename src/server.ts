/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Strategy as WindowsLiveStrategy} from 'passport-windowslive';

export default class Server {
	
	app: Express;
	
	constructor(public port: number) {
		this.app = (<any>express).default();
		
		this.app.use(express.static(process.cwd() + '/pub'));
		
		passport.use(<any>new WindowsLiveStrategy({
			clientID: '000000004816E23D',
			clientSecret: 'sy9Qmud6CIv0sZ1r950C7QaaQPLPsSmY',
			callbackURL: "http://sanshackgt.azurewebsites.net/auth/windowslive/callback"
		}), this.token.bind(this));
		
		this.app.use(bodyParser.json());
		
		this.app.get('/auth/windowslive', passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic'] }));
		
		this.app.get('/auth/windowslive/callback', passport.authenticate('windowslive'), this.auth.bind(this));
	}
	
	token(accessToken, refreshToken, profile, done) {
		// User.findOrCreate({ windowsliveId: profile.id }, function (err, user) {
		// return done(err, user);
		// });
		console.log(accessToken);
		console.log(refreshToken);
		console.log(profile);
		console.log(done);
	}
	
	auth(req: Request, res: Response) {
		// req.body
		res.json({
			success: true
		});
	}
	
	listen() {
		this.app.listen(this.port, () => {
			console.log('[Server] Listening on port ' + this.port);
		});
	}
}