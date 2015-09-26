/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Passport} from 'passport';
import {Strategy as WindowsLiveStrategy} from 'passport-windowslive';

export default class Server {
	
	app: Express;
	passport: Passport;
	
	constructor(public port: number) {
		this.app = (<any>express).default();
		
		this.app.use(express.static(process.cwd() + '/pub'));
		
		this.passport = new (<any>passport).Passport();
		
		this.passport.use(new WindowsLiveStrategy({
			clientID: '000000004816E23D',
			clientSecret: 'sy9Qmud6CIv0sZ1r950C7QaaQPLPsSmY',
			callbackURL: "http://sanshackgt.azurewebsites.net/auth/windowslive/callback"
		}, this.token.bind(this)));
		
		this.app.use(bodyParser.json());
		
		this.app.get('/auth/windowslive', this.passport.authenticate('windowslive', { scope: ['wl.signin'] }));
		
		this.app.get('/auth/windowslive/callback', this.passport.authenticate('windowslive'), this.auth.bind(this));
	}
	
	token(accessToken, refreshToken, profile, done) {
		// User.findOrCreate({ windowsliveId: profile.id }, function (err, user) {
		// return done(err, user);
		// });
		done(null, {
			windowsliveId: profile.id,
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile
		});
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