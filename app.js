var Server = require('./out/server');

(new Server(process.env.PORT || 8080)).listen();