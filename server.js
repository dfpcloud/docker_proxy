var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:4243';
const env = process.env.dfp_token || 'blank';
const reg_token = process.env.ecr_token || null;

app.all("/*", function (req, res, next) {
    var token = req.get('X-DFP-Token');
    if (token === env) {
        next();
    } else {
        return res.status(401).send({
            "message": "Invalid Token",
            "statusCode": "401",
            "data": null
        });
    }
})

app.all("/v1.32/*", function (req, res) {
    if (reg_token !== null && typeof(reg_token) == "string") {
        var auth = new Buffer(reg_token).toString('base64');
        if (!req.headers['X-Registry-Auth']) {
            req.headers['X-Registry-Auth'] = auth;
        }
    }
    apiProxy.web(req, res, { target: serverOne });
});

app.listen(8080);
