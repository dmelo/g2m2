(function ($, undefined) {
    'use strict';

    /**
     * Class constructor.
     */
    var G2M2 = function() {
    };

    /**
     * Endpoint for GitHub API.
     */
    const ghBaseUrl = 'https://api.github.com';

    /**
     * Load the repo g2m2 configuration.
     *
     * @param user GitHub's username.
     * @param repo GitHub's repository name.
     * @param callback Callback function to be invoked with the loaded config.
     * @return void
     */
    function getConfig(user, repo, callback) {
        var ghUrl = ghBaseUrl + '/repos/' + user + '/' + repo + '/contents/.g2m2.json',
            defaultConfig = {
                'theme': 'bootstrap',
                'css': [],
                'js': []
            };
        $.get(ghUrl, function (data) {
            var config = atob(data.content);
            callback(config);
        }, 'json').fail(function(e) {
            console.log('failed getting config file');
            callback(defaultConfig);
        });
    }

    /**
     * Apply an specific theme.
     *
     * @param theme Theme name.
     * @return void
     */
    function applyTheme(theme) {
        console.log('applying theme: ' + theme);

        switch (theme) {
            case 'bootstrap':
                addCSSs([
                    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
                ]);
                break;
        }
    }

    /**
     * Add the list of CSS URL links to the current page, to be loaded by the
     * browser.
     */
    function addCSSs(cssList) {
        for (var i in cssList) {
            var newCSS = document.createElement('link');
            newCSS.href = cssList[i];
            newCSS.media = 'screen';
            newCSS.rel = 'stylesheet';
            newCSS.type = 'text/css';

            $('head').append(newCSS);
        }
    }

    /**
     * Add the list of JS URL links to the current page, to be loaded by the
     * browser.
     */
    function addJSs(jsList) {
        for (var i in jsList) {
            var newJS = document.createElement('script');
            newJS.src = jsList[i];
            newJS.type = 'text/javascript';

            $('html').append(newJS);
        }

    }

    /**
     * Read and interpret the URL, to load the mardown file, convert to HTML
     * and insert it to the current page.
     */
    G2M2.prototype.apply = function() {
        console.log('applying......');
        var user = window.location.hostname.replace(/\..*/g, ''),
            repo = window.location.pathname.replace(/^\//g, '').replace(/\/.*/g, ''),
            path = window.location.pathname.replace(/^\/.+?\//, ''),
            ghUrlFile = ghBaseUrl + '/repos/' + user + '/' + repo + '/contents/' + path;

        getConfig(user, repo, function(config) {
            console.log(config);
            if ('string' === typeof config.theme) {
                applyTheme(config.theme);
            }

            if ('object' === typeof config.css && config.css.length > 0) {
                addCSSs(config.css);
            }

            if ('object' === typeof config.js && config.js.length > 0) {
                addJSs(config.js);
            }


            $.get(ghUrlFile, function (data) {
                var converter = new showdown.Converter(),
					text      = '#hello, markdown!',
                    html      = converter.makeHtml(atob(data.content));
                $('body').html(html);
            }, 'json');
        });
    };

    window.G2M2 = G2M2;
}(jQuery, undefined));
