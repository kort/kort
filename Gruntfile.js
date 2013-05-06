/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
//
//        lint: {
//            src: 'app/**/*.js',
//            grunt: 'Gruntfile.js',
//            app: 'app.js*',
//            tests: 'test/client/**/*.js'
//        },
        qunit: {
            files: ['test/client/index.html']
        },
        jshint: {
            files: {
                src: 'app/**/*.js',
                grunt: 'grunt.js',
                app: 'app.js*',
                tests: 'test/client/**/*.js'
            },

            options: {
                jquery: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                onevar: true,
                boss: true,
                eqnull: true,
                browser: true,
                devel: true,
                trailing: true,
                white:  false,
                maxcomplexity: 3,
                /*indent: 4  comment out until white/indent options are separated => https://github.com/jshint/jshint/issues/655 */
                globals: {
                    Kort: true,
                    Ext: true,
                    L: true,
                    UrlLib: true
                }
            },

            tests: {
                globals: {
                    Ext: true,
                    L: true,
                    UrlLib: true,
                    urlLib: true,
                    asyncTest: true,
                    api_test: true,
                    deepEqual: true,
                    equal: true,
                    expect: true,
                    module: true,
                    notDeepEqual: true,
                    notEqual: true,
                    notStrictEqual: true,
                    ok: true,
                    QUnit: true,
                    raises: true,
                    start: true,
                    stop: true,
                    strictEqual: true,
                    test: true,
                    testSkip: true
                }
            }
        }
    });

    // Default task.
    //grunt.registerTask('default', 'lint qunit concat min'); //old style v0.3.x
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.registerTask('default', ['lint']);
    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']); //new style v0.4.x

    // Travis CI task.
    //grunt.registerTask('travis', 'lint qunit');
};
