/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Passport} from 'passport';
import {Strategy as WindowsLiveStrategy} from 'passport-windowslive';
import * as session from 'express-session';
import {Strategy as BearerStrategy} from 'passport-http-bearer';

export default class Server {
	
	app: Express;
	passport: Passport;
	
	constructor(public port: number) {
		this.app = (<any>express).default();
		this.passport = new (<any>passport).Passport();
		
		this.passport.use(new WindowsLiveStrategy({
			clientID: '000000004816E23D',
			clientSecret: 'sy9Qmud6CIv0sZ1r950C7QaaQPLPsSmY',
			// callbackURL: "https://sanshackgt.azurewebsites.net/auth/windowslive/callback"
			callbackURL: "http://lmb1w.canain.com:8080/auth/windowslive/callback"
		}, this.token.bind(this)));
		
		this.passport.use(new BearerStrategy((token, done) => {
			done(null, {
				data: token
			}, {
				scope: 'all'
			});
		}));
		
		this.passport.serializeUser((user, done) => {
			done(null, user);
		});
		
		this.passport.deserializeUser((user, done) => {
			done(null, user);
		});
		
		this.app.use(express.static(process.cwd() + '/pub'));
		this.app.use(bodyParser.json());
		// this.app.use((<any>session).default({secret: 'sanshackgt'}));
		this.app.use(this.passport.initialize());
		// this.app.use(this.passport.session());
		
		this.app.get('/auth/windowslive', this.passport.authenticate('windowslive', {
			session: false,
			scope: ['wl.signin']
		}));
		this.app.get('/auth/windowslive/callback', this.passport.authenticate('windowslive', {
			session: false
		}), this.auth.bind(this));
		this.app.get('/profile', this.passport.authenticate('bearer', {
			session: false
		}), this.profile.bind(this));
	}
	
	profile(req: Request, res: Response) {
		res.json({
			success: true,
			user: req.user.data
		});
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
		res.json({
			access_token: req.user.accessToken
		});
		// req.body
	}
	
	listen() {
		this.app.listen(this.port, () => {
			console.log('[Server] Listening on port ' + this.port);
		});
	}
}