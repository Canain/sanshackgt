/// <reference path="reference.d.ts" />

import Server from './server';

(new Server(process.env.PORT)).listen();