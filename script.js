/* jshint node: true */
/* global: casper */
"use strict";

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs('node_modules/casperjs/bin/bootstrap.js');

var LOGIN_URLS = [
    'https://meta.stackoverflow.com/users/login',
    'https://gaming.stackexchange.com/q/362743/100465',
    'https://gaming.meta.stackexchange.com/q/15393/100465',
    'https://japanese.stackexchange.com/questions/29419/difference-between-%e3%83%93%e3%83%bc%e3%83%95-and-%e7%89%9b%e8%82%89/29421#29421',
    'https://japanese.meta.stackexchange.com/q/2166/9861',
    'https://security.stackexchange.com/questions/219320/leak-multiple-lines-from-file',
    'https://security.meta.stackexchange.com/q/3399'
    
];
var start = +new Date();

var casper = require('casper').create({
    exitOnError: true,
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});

var email = casper.cli.get(0);
var password = casper.cli.get(1);

casper.echo('Today: ' + new Date());

if (!email || !password || !(/@/).test(email)) {
    casper.die('USAGE: casperjs stackoverflow-fanatic.js <email> <password> --ssl-protocol=any', 1);
} else {
    casper.echo('Loading login page');
}
casper.start()
    .each(LOGIN_URLS, function (casper, link) {
        if(LOGIN_URLS.indexOf(link)===0){

            casper.thenOpen(link, function () {
                this.echo('Logging in using email address ' + email +
                    ' and password ' + (new Array(password.length + 1)).join('*'));
                this.fill('#login-form', {email: email, password: password}, true);
            });

            casper.wait(500);

            casper.then(function () {
                if (this.getCurrentUrl().indexOf(link) === 0) {
                    this.die('Could not log in. Check your credentials.');
                } else {
                    this.echo('Clicking profile link');
                    this.click('.my-profile');
                    this.then(function () {
                        this.echo('User ' + this.getCurrentUrl().split('/').reverse()[0] + ' logged in!' +
                            '\nTook ' + (((+new Date()) - start) / 1000) + 's');
                    });
                }
            });
        }else{
            casper.thenOpen(link, function () {
                this.echo(link+' visited');
            });
        }
    });


casper.run();
