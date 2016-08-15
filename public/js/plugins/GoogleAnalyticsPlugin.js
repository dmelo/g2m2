define(['jquery'], function ($) {
    'use strict';

    var GoogleAnalyticsPlugin = function () {
        this.googleAnalyticsId = '';
    };

    GoogleAnalyticsPlugin.prototype.postLoadConfig = function (config) {
        this.googleAnalyticsId = config.googleAnalyticsId;

        return config;
    };

    GoogleAnalyticsPlugin.prototype.postHtmlCalc = function (html) {
        html += "<script>\n" +
"  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n" +
"  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n" +
"  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n" +
"  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n" +
"\n" +
"  ga('create', '" + this.googleAnalyticsId + "', 'auto');\n" +
"  ga('send', 'pageview');\n" +
"\n" +
"</script>";

        return html;

    };

    return new GoogleAnalyticsPlugin();
});
