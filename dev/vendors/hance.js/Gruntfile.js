"use strict";
var util = require('./lib/grunt/utils.js');

module.exports = function (grunt) {
    //var HN_VERSION = util.getVersion();
    //var dist = 'dist-' + HN_VERSION.full;

    util.init();
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '',
        clean: {
            dist: {
                src: ['dist/**']
            }
        },
        connect: {
            devserver: {
                options: {
                    port: 8000,
                    hostname: '0.0.0.0',
                    base: './dev',
                    keepalive: true,
                    middleware: function (connect, options) {
                        return [
                            connect.favicon('images/favicon.ico'),
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            },
            testserver: {
                options: {
                    // We use end2end task (which does not start the webserver)
                    // and start the webserver as a separate process (in travis_build.sh)
                    // to avoid https://github.com/joyent/libuv/issues/826
                    port: 8000,
                    hostname: '0.0.0.0',
                    base: './dev',
                    middleware: function (connect, options) {
                        return [
                            function (req, resp, next) {
                                // cache get requests to speed up tests on travis
                                if (req.method === 'GET') {
                                    resp.setHeader('Cache-control', 'public, max-age=3600');
                                }

                                next();
                            },
                            connect.favicon('images/favicon.ico'),
                            connect.static(options.base)
                        ];
                    }
                }
            }
        },
        test: {
            hance: 'karma.conf.js'
        },
        autotest: {
            hance: 'karma.conf.js'
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['dev/vendors/requirejs/require.js', '<%= concat.dist.dest %>'],
                dest: 'dist/scripts/require.js'
            }
        },
        uglify: {
            options: {
                banner: '',
                sourceMap: 'dist/scripts/require-map.js',
                sourceMapRoot: './',
                sourceMappingURL: 'require-map.js',
                sourceMapPrefix: 'dist/scripts/'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/scripts/require.min.js'
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'dev/scripts/.jshintrc'
                },
                src: ['dev/scripts/**/*.js']
            }
        },
        watch: {
            script: {
                files: ['dev/scripts/**/*.js'],
                tasks: ['jshint:src']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadTasks('lib/grunt');

    grunt.registerTask('default', ['jshint', 'less']);
    grunt.registerTask('webserver', ['connect:devserver']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'concat', 'uglify']);
};
