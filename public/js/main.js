requirejs.config({
    baseUrl: '/js/'
});

define(['g2m2'], function(g2m2) {
    $(document).ready(function() {
        g2m2.apply();
    });
});
