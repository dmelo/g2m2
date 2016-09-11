/*global define, atob, escape*/
/*jslint regexp: true, browser: true, plusplus: true*/

define(
    [
        'jquery',
        'showdown',
        'js-yaml',
        'RepoMap',
        'plugins/BootstrapPlugin',
        'plugins/GoogleAnalyticsPlugin',
        'plugins/DisqusPlugin'
    ],
    function ($, showdown, jsYaml, RepoMap) {
        'use strict';

        /**
         * Endpoint for GitHub API.
         */
        var ghBaseUrl = 'https://api.github.com', // Endpoint for GitHub API.
            user, // GitHub username.
            repo, // GitHub repo name.
            path, // Path to the MarkDown file or directory
            indexFilePath = null, // The path to the index file.
            hasConfig = false, // Boolean variable that indicates if the repo have a .g2m2.json file.
            g2m2 = function () { return undefined; };

        /**
         * Warn the user about error trying to render the request.
         */
        function error(code, msg) {
            $('body').html('<p>Error ' + code + '. Msg: ' + msg + '</p>');
        }

        function listContent(fileList, path) {
            var md = '#Index of ' + path + "\n\n",
                i,
                node,
                text,
                link;

            if ('' !== path && '/' !== path) {
                md += '- [Up](' + '/' + repo + '/' + path.replace(/\/$/, '').
                        replace(/[^\/]*?$/, '') + ')\n';
            }

            for (i = 0; i < fileList.length; i++) {
                node = fileList[i];
                text = '';
                link = '';

                if ('file' === node.type) {
                    text = node.name.replace(/\.md$/g, '').replace(/[\-]/g, ' ').
                        replace(/_/g, '\\_');
                } else {
                    text = node.name + '/';
                }
                link = path.replace(/\/$/g, '').replace(/.*\//, '') + '/' +
                    node.name.replace(/\.md$/g, '');

                md += '- [' + text + '](' + link + ')\n';
            }

            return md;
        }

        function resolveImages(md) {
            return md.
                replace(
                    /\!\[(.*?)\]\(([^http|\/].*?)\)/g, // when uri starts with /
                    "![$1](https://github.com/" + user + "/" + repo +
                        "/raw/master/" + path.replace(/[^\/]*$/, '') + "$2)"
                ).
                replace(
                    /\!\[(.*?)\]\((\/.*?)\)/g, // when uri starts without the /
                    "![$1](https://github.com/" + user + "/" + repo +
                        "/raw/master/$2)"
                );
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
                var key,
                    key2,
                    key3,
                    node,
                    auxName,
                    extensionList = ['md', 'mdown', 'markdown'],
                    filenameList = ['index', 'readme', 'read'];

                // iterate on each file returned.
                for (key = 0; key < data.length; key++) {
                    node = data[key];

                    // check config file.
                    if ('.g2m2.json' === node.path && 'file' === node.type) {
                        hasConfig = true;
                    }

                    // check index file.
                    if (null === indexFilePath) {
                        for (key2 = 0; key2 < filenameList.length; key2++) {
                            for (key3 = 0; key3 < extensionList.length; key3++) {
                                auxName = filenameList[key2] + "." +
                                    extensionList[key3];
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
                error(1, 'Failed requesting URL ' + ghUrl + '. ' + e);
                callback(false);
            });
        }

        /**
         * Call all hooks from registered plugins for a particular trigger.
         *
         * @param eventName Event identifier.
         * @param arg Argument to be passed for the plugins.
         * @returns returns the arg param that may have been altered by the plugins.
         */
        function callPlugins(eventName, arg) {
            var key,
                plugin;

            for (key in $.g2m2Plugins) {
                plugin = $.g2m2Plugins[key];

                if ('object' === typeof plugin &&
                        'function' === typeof plugin[eventName]) {
                    console.log(
                        "callPlugins eventName: " + eventName + ", plugin: " +
                            key
                    );
                    arg = plugin[eventName](arg);
                }
            }

            return arg;
        }

        function returnLoadConfig(config, callback) {
            callback(config);
        }

        /**
         * Load the repo g2m2 configuration.
         *
         * @param user GitHub's username.
         * @param repo GitHub's repository name.
         * @param callback Callback function to be invoked with the loaded config.
         * @returns void
         */
        function loadConfig(user, repo, callback) {
            var ghUrl = ghBaseUrl + '/repos/' + user + '/' + repo +
                '/contents/.g2m2.json',
                defaultConfig = {
                    'theme': 'bootstrap',
                    'css': [],
                    'js': [],
                    'plugins': []
                };

            $.g2m2Plugins = {};

            if (hasConfig) {
                $.get(ghUrl, function (data) {
                    returnLoadConfig(
                        JSON.parse(atob(data.content.replace(/\s/g, ""))),
                        callback
                    );
                }, 'json').fail(function (e) {
                    console.error(
                        'hasConfig is set to true but it failed getting the ' +
                            'config file: ' + e
                    );
                    returnLoadConfig(defaultConfig, callback);
                });
            } else {
                returnLoadConfig(defaultConfig, callback);
            }
        }

        /**
         * Add the list of CSS URL links to the current page, to be loaded by the
         * browser.
         */
        function addCSSs(cssList) {
            var key,
                newCSS;

            for (key = 0; key < cssList.length; key++) {
                newCSS = document.createElement('link');
                newCSS.href = cssList[key];
                newCSS.media = 'screen';
                newCSS.rel = 'stylesheet';
                newCSS.type = 'text/css';

                $('head').append(newCSS);
            }
        }

        /**
         * Apply an specific theme.
         *
         * @param theme Theme name.
         * @returns void
         */
        function applyTheme(config) {
            console.log('applying theme: ' + config.theme);

            switch (config.theme) {
            case 'bootstrap':
                addCSSs([
                    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
                ]);
                config.plugins.push('plugins/BootstrapPlugin');
                break;
            }

            return config;
        }

        /**
         * Add the list of JS URL links to the current page, to be loaded by the
         * browser.
         *
         * @param jsList A list of js scripts to be loaded by the page,
         * asynchronously.
         */
        function addJSs(jsList) {
            var key,
                newJS;

            for (key = 0; key < jsList.length; key++) {
                newJS = document.createElement('script');
                newJS.src = jsList[key];
                newJS.type = 'text/javascript';

                $('html').append(newJS);
            }
        }

        /**
         * Use RequireJS to load a list of scripts and, after all are properly
         * loaded, run the callback function.
         *
         * @param jsList list of js scripts.
         * @param callback Callback function to run.
         * @returns void.
         */
        function requireAll(jsList, callback) {
            // if there is more scripts to load
            if ('object' === typeof jsList && jsList.length > 0) {
                require([jsList[0]], function (data) {
                    console.log('load: ' + jsList[0]);
                    console.log(data);

                    $.g2m2Plugins[jsList[0]] = data;
                    requireAll(jsList.slice(1), callback);
                });
            } else { // otherwise, run callback.
                callback();
            }
        }

        /**
         * Converts UTF-8 to Latin1
         *
         * @param str Text string in UTF-8 format.
         * @returns string Latin1 encoded string.
         */
        function utf8ToLatin1(str) {
            return decodeURIComponent(escape(str));
        }

        /**
         * Read and interpret the URL, to load the mardown file, convert to HTML
         * and insert it to the current page.
         */
        g2m2.apply = function () {
            // resolve GitHub user and repo.
            var repoMap = new RepoMap();
            repoMap.setLocation(window.location);
            user = repoMap.getUser();
            repo = repoMap.getRepo();

            // get root path.
            getRootPath(function (ret) {
                if (ret) {
                    // get config file.
                    loadConfig(user, repo, function (config) {
                        console.log(config);
                        if ('string' === typeof config.theme) {
                            config = applyTheme(config);
                        }

                        if ('object' === typeof config.css && config.css.length > 0) {
                            addCSSs(config.css);
                        }

                        if ('object' === typeof config.js && config.js.length > 0) {
                            addJSs(config.js);
                        }

                        requireAll(config.plugins, function () {
                            config = callPlugins("postLoadConfig", config);

                            // if match ^/something$ or ^/something/$ then use
                            // indexFilePath. Otherwise, remove the first string ^/something/.
                            path = '/' === repoMap.getPath() ? indexFilePath : repoMap.getPath();

                            path = callPlugins("postPathCalc", path);

                            var ghUrlFile = ghBaseUrl + '/repos/' + user + '/' + repo +
                                    '/contents/' + (path.match(/\.md$/) ? path : path + '.md'),
                                converter = new showdown.Converter(
                                    {
                                        tables: true,
                                        strikethrough: true,
                                        parseImgDimensions: true,
                                        tasklists: true
                                    }
                                );

                            ghUrlFile = callPlugins("postGhUrlFileCalc", ghUrlFile);

                            // get file
                            $.get(ghUrlFile, function (data) {
                                var content = callPlugins(
                                        "postContentCalc",
                                        utf8ToLatin1(atob(data.content.replace(/\s/g, "")))
                                    ),
                                    yaml = content.match(/[\s\S]*\/\*[\s\S]*[\s\S]*/) ? content.replace(/[\s\S]*\/\*/g, '').replace(/\*\/[\s\S]*/g, '') : '',
                                    yamlObj,
                                    md = resolveImages(callPlugins("postMdCalc", content.replace(/\/\*[\s\S]*\*\//g, ''))),
                                    html = callPlugins("postHtmlCalc", converter.makeHtml(md));


                                try {
                                    yamlObj = callPlugins("postYamlObjCalc", jsYaml.safeLoad(yaml));
                                } catch (err) {
                                    console.log("error loading yaml: " + yaml);
                                }
                                console.log(content);

                                $.md = md;

                                if ('object' === typeof yamlObj && 'string' === typeof yamlObj.Title) {
                                    $('html head title').html(yamlObj.Title);
                                }

                                if ('object' === typeof yamlObj && 'string' === typeof yamlObj.Description) {
                                    $('html head meta[name="description"]').
                                        attr('content', yamlObj.Description);
                                }

                                $('body').html(html);
                                callPlugins('afterall', null);
                            }, 'json').fail(function (e) {
                                console.log('error 404: ' + e);
                                console.log(path);
                                var ghUrlDir = ghBaseUrl + '/repos/' + user + '/' + repo +
                                    '/contents/' + path;

                                $.get(ghUrlDir, function (data) {
                                    var md = callPlugins("postMdCalc", listContent(data, path));

                                    $('body').html(callPlugins("postHtmlCalc", converter.makeHtml(md)));
                                }, 'json');
                            });
                        });
                    });
                }
            });
        };

        return g2m2;
    }
);
