var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:4243';
const env = process.env.dfp_token || 'blank';
const reg_token = process.env.token;
//const url = process.env.ecr_url;

app.all("/*", function(req, res, next){
    var token = req.get('X-DFP-Token');
    if(token === env){
        next();
    }else {
        return res.status(401).send({
            "message": "Invalid Token",
            "statusCode": "401",
            "data": null
        }); 
    }
})
 
app.all("/v1.32/*", function(req, res) {
	var auth = new Buffer(reg_token).toString('base64');
	req.headers['X-Registry-Auth'] = auth;
    apiProxy.web(req, res, {target: serverOne});
});

app.listen(8080);
