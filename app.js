var Promise = require('bluebird');
var request = require('request');
var phantom = require('phantom');
var phantomPath = require('phantomjs').path;

var phInstance;
var phPage;

phantom.create([], { phantomPath: phantomPath })
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    }).then(page => {
        phPage = page;

        page.setting("userAgent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36");
        page.setting("javascriptEnabled", true);
        page.setting("loadImages", true);

        page.on("onResourceRequested", function(requestData) {
            console.info('Requesting', requestData.url)
        });


        return page.open('https://oauth.vk.com/authorize?client_id=3682744&display=wap&redirect_uri=oauth.vk.com/blank.html&scope=wall,offline&response_type=token&v=5.62');
    }).then(function(status){
        console.log(status);

        return phPage.property('content');
    }).then(function(content){
        //console.log(content);

        setTimeout(() => {

            phPage.on("onLoadFinished", function(status) {
                phPage.evaluate(function() {
                    return document.getElementsByTagName('body')[0];
                }).then(body => {
                   console.log(body.innerHTML);
                    process.exit(0);
                })
            });

            phPage.evaluate(function() {
                var email = document.getElementsByName('email')[0];
                email.value = "Gvinar@yandex.ru";
                var pass = document.getElementsByName('pass')[0];
                pass.value = "glazunov523923";

                var form = document.getElementsByTagName('form')[0];
                form.submit();
            })


            //phPage.evaluate(function(){
            //    return document.getElementsByName('email');
            //}).then(email => {
            //    console.log(email[0].value);
            //    email[0].value = "Gvinar@yandex.ru";
            //    console.log(email[0].value);
            //    return phPage.evaluate(function(){
            //        return document.getElementsByName('pass');
            //    });
            //}).then(pass => {
            //    pass[0].value = "glazunov523923";
            //    return phPage.evaluate(function(){
            //        return document.getElementsByTagName('body');
            //    });
            //.then(body => {
            //    console.log(body.innerHTML);
            //    process.exit(0);
            //});
        }, 2000);
    }).catch(error => {
    console.log(error);
    phInstance.exit();
    process.exit(1);
});
    //const page = await instance.createPage();
    //await page.on("onResourceRequested", function(requestData) {
    //    console.info('Requesting', requestData.url)
    //});
    //
    //const status = await page.open('https://stackoverflow.com/');
    //console.log(status);
    //
    //const content = await page.property('content');
    //console.log(content);

    //await instance.exit();

//
//var casper = require('casper').create();
//var x = require('casper').selectXPath;
//
//casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0');