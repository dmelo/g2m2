define(['jquery'], function ($) {
    'use strict';

    var BootstrapPlugin = function () {
    };

    BootstrapPlugin.prototype.postHtmlCalc = function(html) {
        return '<div class="container">' + html + '</div>';
    };
    
    return new BootstrapPlugin();
});
