declare module 'passport-windowslive' {
	import * as passport from 'passport';
	import * as express from 'express';
	
	interface StrategyOptions {
		clientID: string;
		clientSecret: string;
		callbackURL: string;
	}
	
	interface TokenHandler {
		(accessToken, refreshToken, profile, done);
	}
	
	export class Strategy implements passport.Strategy {
        name: string;
        authenticate(req: express.Request, options?: Object): void;
		
		constructor(options: StrategyOptions, handler: TokenHandler);
	}
}