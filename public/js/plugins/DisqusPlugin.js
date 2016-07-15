(function ($) {
    'use strict';

    var DisqusPlugin = function () {
        this.disqusId = '';
    };

    DisqusPlugin.prototype.postLoadConfig = function (config) {
        this.disqusId = config.disqusId;

        return config;
    };


    DisqusPlugin.prototype.postHtmlCalc = function (html) {
        html += " \n\
        <div id=\"disqus_thread\"></div>\n\
            <script type=\"text/javascript\">\n\
                /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n\
                var disqus_shortname = '" + this.disqusId + "';\n\
\n\
                /* * * DON'T EDIT BELOW THIS LINE * * */\n\
                (function() {\n\
                    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n\
                    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';\n\
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n\
                })();\n\
            </script>\n\
            <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n\
            <a href=\"http://disqus.com\" class=\"dsq-brlink\">comments powered by <span class=\"logo-disqus\">Disqus</span></a>";
        console.log("postHtmlCalc");
        console.log(html);

        return html;
    };

    $.g2m2Plugins.disqus = new DisqusPlugin();
}(jQuery));

