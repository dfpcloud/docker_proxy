var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:4243';
var env = process.env.dfp_token || 'blank';
var child = require('child_process');
var auth;

child.exec("sudo -u root -H sh -c 'aws ecr get-login --no-include-email'", (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    var subStr = stdout.split(" ");
    var data = {
        "username": subStr[3],
        "password": subStr[5],
        "serveraddress": subStr[6].replace(/(\r\n|\n|\r)/gm, "")
    }
    auth = new Buffer(JSON.stringify(data)).toString('base64');
});


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
    if (!req.headers['X-Registry-Auth']) {
        req.headers['X-Registry-Auth'] = auth;
    }
    apiProxy.web(req, res, { target: serverOne });
});

app.listen(8080);
