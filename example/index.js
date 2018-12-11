'use strict';
const http  = require('http');
const kelp  = require('kelp');
const error = require('..');

const app = kelp();

app.use(error);

app.use(function(req, res){
  throw new Error('BOOM!');
});

http.createServer(app).listen(3000);
