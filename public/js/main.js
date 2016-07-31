requirejs.config({
    baseUrl: '/js/'
});

define(['g2m2'], function(g2m2) {
    console.log(g2m2);
    g2m2.apply();
});
