module.exports = function(grunt) {
	grunt.initConfig({
		requirejs: {
			build: {
				options: {
					appDir: 'src',
					dir: 'dist',
					baseUrl: 'js',
					paths: {
						'jquery': 'lib/jquery/jquery-2.0.0.min',
						'jquery.qrcode': 'lib/jquery-qrcode/jquery.qrcode.min',
						'underscore': 'lib/underscore/underscore-amd-min',
						'underscore.string': 'lib/underscore/underscore.string.min',
						'knockout': 'lib/knockout/knockout-2.2.1',
						'mousetrap': 'lib/mousetrap/mousetrap.min',
						'hammer': 'lib/hammer/hammer.min',
						'bootstrap-modal': 'lib/bootstrap-modal/bootstrap-modal',
						'bootstrap-modalmanager': 'lib/bootstrap-modal/bootstrap-modalmanager',
						'text': 'lib/require/text'
					},
					preserveLicenseComments: false,
					name: 'app'
				}
			}
		},
		replace: {
			build: {
				options: {
					variables: {'timestamp': '<%= new Date().getTime() %>'}
				},
				files: [
					{src: ['dist/index.html'], dest: 'dist/index.html'},
					{src: ['dist/app.html'], dest: 'dist/app.html'}
				]
			}
		},
		clean: {
			build: [
				'dist/build.txt', 'dist/img/*.ai'
			]
		},
		ghPages: {
			options: {
				base: 'dist'
			},
			src: ['**']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('less', 'Optimize Less files', function() {
		require('lessless').optimizeProject('dist');
	});
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.registerTask('build', ['requirejs', 'less', 'replace', 'clean']);
	grunt.registerTask('deploy', ['build', 'ghPages']);
};
