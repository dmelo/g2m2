define(['jquery'], function ($) {
    'use strict';

    var BootstrapPlugin = function () {
    };

    BootstrapPlugin.prototype.postHtmlCalc = function(html) {
        return '<div class="container">' + html + '</div>';
    };

    BootstrapPlugin.prototype.postHtmlApply = function() {
        $('table').addClass('table table-striped');
    };
    
    return new BootstrapPlugin();
});
