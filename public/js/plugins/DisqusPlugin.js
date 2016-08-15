(function ($) {
    'use strict';

    var DisqusPlugin = function () {
        this.disqusId = '';
    };

    DisqusPlugin.prototype.postLoadConfig = function (config) {
        this.disqusId = config.disqusid;

        return config;
    };

    DisqusPlugin.prototype.postHtmlCalc = function (html) {
        html += "\n" +
            "<div id=\"disqus_thread\"></div>\n" +
            "<script>\n" +
            "    (function() {  // DON'T EDIT BELOW THIS LINE\n" +
            "        var d = document, s = d.createElement('script'),\n" +
            "            disqusId = '" + this.disqusId + "';\n" +
            "        \n" +
            "        s.src = '//' + disqusId + '.disqus.com/embed.js';\n" +
            "        \n" +
            "        s.setAttribute('data-timestamp', +new Date());\n" +
            "        (d.head || d.body).appendChild(s);\n" +
            "    })();\n" +
            "</script>\n" +
            "<noscript>Please enable JavaScript to view the <a href=\"https://disqus.com/?ref_noscript\" rel=\"nofollow\">comments powered by Disqus.</a></noscript>\n";

        return html;
    };

    return new DisqusPlugin();
}(jQuery));

