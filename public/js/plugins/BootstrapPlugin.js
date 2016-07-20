(function ($) {
    'use strict';

    var BootstrapPlugin = function () {
    };

    BootstrapPlugin.prototype.postHtmlCalc = function(html) {
        return '<div class="container">' + html + '</div>';
    };
    
    $.g2m2Plugins.bootstrap = new BootstrapPlugin();
}(jQuery));

