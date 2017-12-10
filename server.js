var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:4243';
const env = process.env.TOKEN || 'blank';

app.all("/*", function(req, res){
    var token = req.get('X-DFP-Token');
    if(token === env){
        console("valid");
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
    apiProxy.web(req, res, {target: serverOne});
});

app.listen(8080);