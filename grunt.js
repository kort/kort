/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        qunit: {
            files: ['test/client/index.html']
        },
        lint: {
            src: 'app/**/*.js',
            grunt: 'grunt.js',
            app: 'app.js*',
            tests: 'test/client/**/*.js'
        },
        jshint: {
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
                maxcomplexity: 3
                /*indent: 4  comment out until white/indent options are separated => https://github.com/jshint/jshint/issues/655 */
            },
            globals: {
                Kort: true,
                Ext: true,
                L: true,
                UrlLib: true
            },
            tests: {
                globals: {
                    Ext: true,
                    L: true,
                    UrlLib: true,
                    asyncTest: true,
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
                    test: true
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

    // Travis CI task.
    grunt.registerTask('travis', 'lint qunit');
};
