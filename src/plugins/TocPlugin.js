define(['jquery', 'toc'], function ($, toc) {
    'use strict';

    var TocPlugin = function () { return undefined; };

    TocPlugin.prototype.postHtmlApply = function () {
        if (0 < $('#toc').length) {
            $('#toc').toc({container: $('#toc').parent()});
        }
    };

    return new TocPlugin();
});
