requirejs.config({
    baseUrl: '/js',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        showdown: '../bower_components/showdown/dist/showdown',
        'js-yaml': '../bower_components/js-yaml/dist/js-yaml',
        json: '../bower_components/requirejs-plugins/src/json',
        text: '../bower_components/requirejs-plugins/lib/text'
    }
});

define(['jquery', 'g2m2'], function($, g2m2) {
    console.log(g2m2);
    $.g2m2Plugins = {};
    g2m2.apply();
});
