module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    karma: {
        unit: {
            configFile: 'karma.conf.js',
        }
    },

    watch: {
        src: {
            files: ['consultations/*.js', 'patients/*.js', 'app.js'],
            tasks: ['jshint:src'],
        }
    },

    connect: {
        dev: {
            options: {
                port: 9000,
            }
        }
    },

    jshint: {
        all: {
            files: ['consultations/*.js'],
        },
        options: {
            reporter: 'jslint',
            smarttabs: true,
        }
    },

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['karma']);
    grunt.registerTask('dev', ['watch', 'connect:dev']);
    grunt.registerTask('jshint', ['jshint']);
};
