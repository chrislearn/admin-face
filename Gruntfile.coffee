'use strict';

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    banner: ''
    clean:
      dist:
        src: ['dist/**']
    "regex-replace":
      dist:
        src: ['dist/*.html','dist/includes/*.php']
        actions: [
            {
                name: 'requirejs',
                search: '<script data-main="scripts/config" src="vendors/requirejs/require.js"></script>'
                replace: '<script src="scripts/require.min.js"></script>'
                flags: 'ig'
            }
        ]
    concat:
      options:
        banner: '<%= banner %>'
        stripBanners: true
      dist:
        src: ['dev/vendors/requirejs/require.js', '<%= concat.dist.dest %>'],
        dest: 'dist/scripts/require.js'
    uglify:
      options:
        banner: '',
        sourceMap: 'dist/scripts/require-map.js'
        sourceMapRoot: './'
        sourceMappingURL: 'require-map.js'
        sourceMapPrefix: 'dist/scripts/'
      dist:
        src: '<%= concat.dist.dest %>'
        dest: 'dist/scripts/require.min.js'
    jshint:
      gruntfile:
        options:
          jshintrc: '.jshintrc'
        src: 'Gruntfile.js'
      dev:
        options:
          jshintrc: 'dev/scripts/.jshintrc'
        src: ['dev/scripts/**/*.js']
      test:
        options:
          jshintrc: 'test/.jshintrc'
        src: ['test/**/*.js']
    less:
      compile:
        options:
          paths: ['dev/styles/']
          compress: true
        files: [{
          expand: true,
          cwd: 'dev/styles'
          src: ['**/main.less']
          dest: 'dev/styles'
          ext: '.css'
        }]
    watch:
      style:
        files: ['dev/styles/**/*.less'],
        tasks: ['less']
    requirejs:
      compile:
        options:
          baseUrl: 'dev/',
          name: 'scripts/config',
          mainConfigFile: 'dev/scripts/config.js',
          out: '<%= concat.dist.dest %>',
          optimize: 'none'
    imagemin:
      dist:
        options:
          optimizationLevel: 3
        files: [{
          expand: true,
          cwd: 'dev/',
          src: ['**/*.png', '**/*.jpg', '**/*.gif'],
          dest: 'dist/'
        }]
    htmlmin:
      dist:
        options:
          files: [{
            expand: true,
            cwd: 'dev',
            src: ['**/*.html', '!**/vendors/**/*.html'],
            dest: 'dist/'
          }]
    copy:
      createjs:
        files: [{
          expand: true,
          cwd: '../createjs/'
          src: ['**/*.png','**/*.jpg','**/*.gif']
          dest: 'dev/tribes/createjs/'
        }]
      dist:
        files: [{
          expand: true
          cwd: 'dev/'
          src: ['**', '!**/images/*.jpg', '!**/images/*.jepg', '!**/images/*.png', '!**/images/*.gif', '!**/*.less', 'scripts/**/*.min.js']
          dest: 'dist/'}]
    connect:
      devserver:
        options:
          keepalive: true
          hostname: '127.0.0.1'
          base: './dev'
          port: 8000
          livereload: 35729
          open: true
    strip:
      main:
        src: "dist/scripts/require.js"
        dest: "dist/scripts/require.js"
        options: 
          nodes : ['console.log', 'debug']

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-requirejs'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-imagemin'
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-regex-replace'
  grunt.loadNpmTasks 'grunt-require-createjs'
  grunt.loadNpmTasks 'grunt-strip'

  grunt.registerTask 'default', ['jshint', 'less']
  grunt.registerTask 'build', ['requirejs', 'less', 'clean:dist', 'copy:dist', 'requirejs', 'concat', 'strip', 'uglify', 'imagemin:dist', 'htmlmin:dist', 'regex-replace:dist']