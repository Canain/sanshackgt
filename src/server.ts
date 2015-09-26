/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Passport} from 'passport';
import {Strategy as WindowsLiveStrategy} from 'passport-windowslive';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import Data from './data';

export default class Server {
	
	app: Express;
	passport: Passport;
	
	data: Data;
	
	constructor(public port: number) {
		this.data = new Data('https://sanshackgt.documents.azure.com', 443, {
			masterKey: 'DOGn8uZHmEF6xKu9NdevnHThYDZfnFHLunZkgrZitRTrHmxCSA74Bu9DBE8Y24RmeYYFpQ2j3S'
		});
		
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
		this.app.use(this.passport.initialize());
		
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
		this.data.users.update({ windowsliveId: profile.id }, {
			access_token: accessToken
		}, { upsert: true }, (error, affectedRows, raw) => {
			done(error, raw);
		});
	}
	
	auth(req: Request, res: Response) {
		res.json({
			access_token: req.user.access_token
		});
		// req.body
	}
	
	listen() {
		this.app.listen(this.port, () => {
			console.log('[Server] Listening on port ' + this.port);
		});
	}
}