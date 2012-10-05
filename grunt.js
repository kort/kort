/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    qunit: {
      files: ['test/index.html']
    },
	lint: {
      src: 'app/**/*.js',
      grunt: 'grunt.js',
      tests: 'test/**/*.js'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
		devel: true
      },
      globals: {
		Ext: true,
		OpenLayers: true
      },
      tests: {
        globals: {
            Ext            : true,
            OpenLayers     : true,
			asyncTest      : true,
			deepEqual      : true,
			equal          : true,
			expect         : true,
			module         : true,
			notDeepEqual   : true,
			notEqual       : true,
			notStrictEqual : true,
			ok             : true,
			QUnit          : true,
			raises         : true,
			start          : true,
			stop           : true,
			strictEqual    : true,
			test           : true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

  // Travis CI task.
  grunt.registerTask('travis', 'lint qunit');
};
