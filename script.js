/* jshint node: true */
/* global: casper */
"use strict";

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs('node_modules/casperjs/bin/bootstrap.js');

var LOGIN_URLS = [
    'https://meta.stackoverflow.com/users/login',
    'https://gaming.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fgaming.stackexchange.com%2fquestions%2f362743%2forigin-of-the-term-ohko',
    'https://gaming.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fgaming.meta.stackexchange.com%2fquestions%2f15393%2fscreenshot-of-the-week-contest-25',
    'https://japanese.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fjapanese.stackexchange.com%2fquestions%2f29419%2fdifference-between-%25E3%2583%2593%25E3%2583%25BC%25E3%2583%2595-and-%25E7%2589%259B%25E8%2582%2589%2f29421',
    'https://japanese.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fjapanese.meta.stackexchange.com%2fquestions%2f2166%2fetiquette-on-deleting-answers',
    'https://security.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fsecurity.stackexchange.com%2fquestions%2f219320%2fleak-multiple-lines-from-file',
    'https://security.stackexchange.com/users/login?ssrc=head&returnurl=https%3a%2f%2fsecurity.meta.stackexchange.com%2fquestions%2f3399%2fare-we-to-avoid-listing-specific-apps-malware'
    
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
