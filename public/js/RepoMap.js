define([], function() {
    'use strict';

    /**
     * Constructor.
     */
    var RepoMap = function () {
        this.location = null;

        // HERE IS THE PLACE TO MAP DOMAINS
        this.map = {
            'diogomelo.net': { 'user': 'dmelo', 'repo': 'g2m2-pages' },
            'g2m2.net': {'user': 'dmelo', 'repo': 'g2m2' }
        };

        // initialize vars.
        this.user = '';
        this.repo = '';
        this.path = '';
    };

    /**
     * Set location (window.location).
     */
    RepoMap.prototype.setLocation = function (location) {
        this.location = location;
        if (this.location.hostname in this.map) {
            var aux = this.map[this.location.hostname];
            this.user = aux.user;
            this.repo = aux.repo;
            this.path = this.location.pathname;
        } else {
            this.user = this.location.hostname.replace(/\..*/g, '');
            this.repo = this.location.pathname.replace(/^\//g, '').
                replace(/\/.*/g, '');
            this.path = this.location.pathname.match(/^\/[^\/]*[/]?$/) ? '/' :
                this.location.pathname.replace(/^\/.+?\//, '');
        }
    };

    /**
     * Get GitHub user.
     */
    RepoMap.prototype.getUser = function () {
        return this.user;
    };

    /**
     * Get GitHub repo.
     */
    RepoMap.prototype.getRepo = function() {
        return this.repo;
    };

    /**
     * Get GitHub path.
     */
    RepoMap.prototype.getPath = function() {
        return this.path;
    }

    return RepoMap;
});
