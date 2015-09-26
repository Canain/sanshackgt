declare module 'passport-google-oauth2' {
	import * as passport from 'passport';
	import * as express from 'express';
	
	interface StrategyOptions {
		clientID: string;
		clientSecret: string;
		callbackURL: string;
		passReqToCallback: boolean;
	}
	
	export class Strategy implements passport.Strategy {
        name: string;
        authenticate(req: express.Request, options?: Object): void;
		
		constructor(options: StrategyOptions);
	}
}