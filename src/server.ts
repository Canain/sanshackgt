/// <reference path="reference/reference.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth2';

export default class Server {
	
	app: Express;
	
	constructor(public port: number) {
		this.app = (<any>express).default();
		
		this.app.use(express.static(process.cwd() + '/pub'));
		
		passport.use(<any>new GoogleStrategy({
			clientID: '359627626289-pnv7i2jgo1dj8v59n391dbrs4uasj4tm.apps.googleusercontent.com',
			clientSecret: 'dNyuLzrIlkQY8LJ4CLiqbOvo',
			callbackURL: 'https://sanshackgt.azurewebsites.net/auth/google/callback',
			passReqToCallback: true
		}), <any>((request, accessToken, refreshToken, profile, done) => {
			console.log(request);
			console.log(accessToken);
			console.log(refreshToken);
			console.log(profile);
			console.log(done);
		}));
		
		this.app.use(bodyParser.json());
		
		this.app.get('/auth/google',
		passport.authenticate('google', { scope: 
			[ 'https://www.googleapis.com/auth/plus.login',
			, 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
		));
		
		this.app.get( '/auth/google/callback', 
			passport.authenticate('google', { 
				successRedirect: '/auth/google/success',
				failureRedirect: '/auth/google/failure'
		}));
		
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