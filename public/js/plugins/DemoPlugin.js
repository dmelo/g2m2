define(['jquery'], function ($) {
    'use strict';

    var DemoPlugin = function () {
    };

    DemoPlugin.prototype.postLoadConfig = function (config) {
        console.log("postLoadConfig");
        console.log(config);

        return config;
    };

    DemoPlugin.prototype.postPathCalc = function (path) {
        console.log("postPathCalc");
        console.log(path);

        return path;
    };

    DemoPlugin.prototype.postGhUrlFileCalc = function (ghUrlFile) {
        console.log("postGhUrlFileCalc");
        console.log(ghUrlFile);

        return ghUrlFile;
    };

    DemoPlugin.prototype.postContentCalc = function (content) {
        console.log("postContentCalc");
        console.log(content);

        return content;
    };

    DemoPlugin.prototype.postYamlObjCalc = function (yamlObj) {
        console.log("postYamlObjCalc");
        console.log(yamlObj);

        return yamlObj;
    };

    DemoPlugin.prototype.postMdCalc = function (md) {
        console.log("postMdCalc");
        console.log(md);

        return md;
    };

    DemoPlugin.prototype.postHtmlCalc = function (html) {
        console.log("postHtmlCalc");
        console.log(html);

        return html;
    };

    return new DemoPlugin();
});
