define(['jquery', 'highlight'], function ($, hljs) {
    'use strict';

    var HighlightPlugin = function () {
        var newCSS = document.createElement('link');
        newCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/styles/default.min.css';
        newCSS.media = 'screen';
        newCSS.rel = 'stylesheet';
        newCSS.type = 'text/css';

        $('head').append(newCSS);

    };

    HighlightPlugin.prototype.postHtmlApply = function() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block)
        });
    };
    
    return new HighlightPlugin();
});
