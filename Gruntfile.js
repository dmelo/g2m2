module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js',
        'public/js/g2m2.js',
        'public/js/main.js',
        'public/js/RepoMap.js',
        'public/js/plugins/BootstrapPlugin.js',
        'public/js/plugins/DemoPlugin.js',
        'public/js/plugins/DisqusPlugin.js',
        'public/js/plugins/GoogleAnalyticsPlugin.js'
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    requirejs: {
      compile: {
        options: {
          name: 'main',
          baseUrl: 'public/js',
          mainConfigFile: 'public/js/main.js',
          include: [
            'require.js'
          ],
          preserveLicenseComments: false,
          out: 'public/js/all.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint']);

};
