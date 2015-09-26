var Server = require('out/server');

(new Server(process.env.PORT || 5000)).listen();