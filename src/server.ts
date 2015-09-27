/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Passport} from 'passport';
import {Strategy as WindowsLiveStrategy} from 'passport-windowslive';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import Data from './data';
import Analyzer from './analyzer';

export default class Server {
	
	app: Express;
	passport: Passport;
	
	data: Data;
	
	analyzer: Analyzer;
	
	constructor(public port: number) {
		this.analyzer = new Analyzer();
		this.data = new Data('sanshackgt.database.windows.net', 'Canain', 'superSecurePassword&');
		
		this.app = (<any>express).default();
		this.passport = new (<any>passport).Passport();
		
		this.passport.use(new WindowsLiveStrategy({
			clientID: '000000004816E23D',
			clientSecret: 'sy9Qmud6CIv0sZ1r950C7QaaQPLPsSmY',
			callbackURL: 'https://sanshackgt.azurewebsites.net/auth/windowslive/callback'
			// callbackURL: "http://lmb1w.canain.com:8080/auth/windowslive/callback"
		}, this.token.bind(this)));
		
		this.passport.use(new BearerStrategy((token, done) => {
			this.data.retrieve(token, (error, id) => {
				done(error, { id: id }, { scope: 'all' });
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
			scope: ['wl.signin', 'wl.basic', 'wl.skydrive', 'wl.skydrive_update']
		}));
		this.app.get('/auth/windowslive/callback', this.passport.authenticate('windowslive', {
			session: false
		}), this.auth.bind(this));
		this.app.post('/analyze', this.passport.authenticate('bearer', {
			session: false
		}), this.analyze.bind(this));
		this.app.post('/set', this.passport.authenticate('bearer', {
			session: false
		}), this.set.bind(this));
		this.app.post('/add', this.passport.authenticate('bearer', {
			session: false
		}), this.add.bind(this));
	}
	
	add(req: Request, res: Response) {
		this.data.add(req.user.id, req.body, (error) => {
			if (error) {
				res.json({
					success: false,
					error: error
				});
			} else {
				res.json({
					success: true
				});
			}
		});
	}
	
	set(req: Request, res: Response) {
		this.data.set(req.user.id, req.body, (error) => {
			if (error) {
				res.json({
					success: false,
					error: error
				});
			} else {
				res.json({
					success: true
				});
			}
		});
	}
	
	analyze(req: Request, res: Response) {
		this.data.items(req.user.id, (error, items) => {
			if (error) {
				return res.json({
					success: false,
					error: error
				});
			}
			this.analyzer.analyze(req.body.cat1, req.body.ca2, items, (error, result) => {
				res.json({
					success: true,
					data: result
				});
			});
		});
	}
	
	token(accessToken, refreshToken, profile, done) {
		this.data.token(profile.id, accessToken, profile, done);
	}
	
	auth(req: Request, res: Response) {
		res.json({
			access_token: req.user.access_token
		});
	}
	
	listen() {
		this.data.connect((error) => {
			if (error) {
				console.error(error);
				return;
			}
			this.app.listen(this.port, () => {
				console.log('[Server] Listening on port ' + this.port);
			});
		});
	}
}