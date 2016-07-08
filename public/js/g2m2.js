define(['jquery', 'showdown', 'js-yaml'], function($, showdown, jsYaml) {
    /**
     * Endpoint for GitHub API.
     */
    const ghBaseUrl = 'https://api.github.com';

    /**
     * GitHub username.
     */
    var user;

    /**
     * GitHub repo name.
     */
    var repo;

    /**
     * Path to the MarkDown file or directory
     */
    var path;

    /**
     * The path to the index file.
     */
    var indexFilePath = null;

    /**
     * Boolean variable that indicates if the repo have a .g2m2.json file.
     */
    var hasConfig = false;

    /**
     * Class constructor.
     */
    var g2m2 = function() {
    };

    /**
     * Warn the user about error trying to render the request.
     */
    function error(code, msg) {
        $('body').html('<p>Error ' + code + '. Msg: ' + msg + '</p>');
    }

    function listContent(fileList, path) {
        var md = '#Index of ' + path + "\n\n";

        console.log(fileList);
        console.log(path);

        if ('' !== path && '/' !== path) {
            md += '- [Up](' + '/' + repo + '/' + path.replace(/\/$/, '').replace(/[^\/]*?$/, '') + ')\n';
        }

        for (var i in fileList) {
            var node = fileList[i],
                text = '',
                link = '';

            if ('file' === node.type) {
                text = node.name.replace(/\.md$/, '').replace(/[-]/g, ' ').replace(/_/g, '\\_');
            } else {
                text = node.name + '/';
            }
            link = '/' + repo + '/' + node.path;

            md += '- [' + text + '](' + link + ')\n';
        }

        return md;
    }


    /**
     * Get the root path of the user/repo and search for .g2m2.json file and
     * index file. In case it is successfull in quering GitHub about the root
     * path, it calls the callback with true, as argument. Otherwise, calls
     * callback with false.
     */
    function getRootPath(callback) {
        // URL that returns a list of objects, each representing a file/dir on
        // the root path of the repo.
        var ghUrl = ghBaseUrl + '/repos/' + user + '/' + repo + '/contents/';

        $.get(ghUrl, function (data) {
            rootFileList = data;

            // iterate on each file returned.
            for (var i in data) {
                var node = data[i],
                    extensionList = ['md', 'mdown', 'markdown'],
                    filenameList = ['index', 'readme', 'read'];
                         
                // check config file.
                if ('.g2m2.json' === node.path && 'file' === node.type) {
                    hasConfig = true;
                }

                // check index file.
                if (null === indexFilePath) {
                    for (var j in filenameList) {
                        for (var k in extensionList) {
                            var auxName = filenameList[j] + "." + extensionList[k];
                            if (auxName === node.path.toLowerCase()) {
                                indexFilePath = node.path;
                                break;
                            }
                        }
                        if (null !== indexFilePath) {
                            break;
                        }
                    }
                }

            }
            callback(true);

        }, 'json').fail(function (e) {
            error(1, 'Failed requesting URL ' + ghUrl);
            callback(false);
        });
    }

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

        if (hasConfig) {
            $.get(ghUrl, function (data) {
                callback(JSON.parse(atob(data.content)));
            }, 'json').fail(function (e) {
                console.error(
                    'hasConfig is set to true but it failed getting the config file'
                );
                callback(defaultConfig);
            });
        } else {
            callback(defaultConfig);
        }
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
    g2m2.apply = function() {
        user = window.location.hostname.replace(/\..*/g, '');
        repo = window.location.pathname.replace(/^\//g, '').
                replace(/\/.*/g, '');

        // get root path.
        getRootPath(function (ret) {
            if (ret) {
                // get config file.
                getConfig(user, repo, function(config) {
                    console.log(config);
                    'string' === typeof config.theme && applyTheme(config.theme);
                    'object' === typeof config.css && config.css.length > 0 &&
                        addCSSs(config.css);
                    'object' === typeof config.js && config.js.length > 0 &&
                        addJSs(config.js);

                    path = window.location.pathname.match(/^\/[^\/]*$/) ||
                        '' === window.location.pathname.replace(/^\/.+?\//, '') ?
                        indexFilePath :
                        window.location.pathname.replace(/^\/.+?\//, '');

                    var ghUrlFile = ghBaseUrl + '/repos/' + user + '/' + repo +
                            '/contents/' + (path.match(/\.md$/) ? path : path + '.md');

                    var converter = new showdown.Converter();
                    // get file
                    $.get(ghUrlFile, function (data) {
                        var content = decodeURIComponent(escape(atob(data.content))),
                            yaml = content.match(/[\s\S]*\/\*[\s\S]*[\s\S]*/) ? content.replace(/[\s\S]*\/\*/g, '').replace(/\*\/[\s\S]*/, '') : '',
                            yamlObj = jsYaml.safeLoad(yaml), // TODO: this can throw exception, handle it.
                            md = content.replace(/\/\*[\s\S]*\*\//g, ''),
                            html = converter.makeHtml(md);

                        if ('object' === typeof yamlObj && 'string' === typeof yamlObj.Title) {
                            $('html head title').html(yamlObj.Title);
                        }

                        if ('object' === typeof yamlObj && 'string' === typeof yamlObj.Description) {
                            $('html head meta[name="description"]').
                                attr('content', yamlObj.Description);
                        }

                        $('body').html(html);
                    }, 'json').fail(function (e) {
                        console.log('error 404');
                        var ghUrlDir = ghBaseUrl + '/repos/' + user + '/' + repo +
                            '/contents/' + path;

                        $.get(ghUrlDir, function(data) {
                            var md = listContent(data, path);

                            $('body').html(converter.makeHtml(md));
                        }, 'json');
                    });
                });
            }
        });
    };

    return g2m2;
});
