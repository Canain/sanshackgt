/// <reference path="reference.d.ts" />

import Server from './server';

(new Server(process.env.PORT === undefined ? 5000 : process.env.PORT)).listen();