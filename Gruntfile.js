module.exports = function(grunt) {
	grunt.initConfig({
		requirejs:{
			build: {
				options:{
					appDir:'src',
					dir:'build',
					baseUrl:'js',
					paths: {
						'jquery': 'lib/jquery/jquery-1.9.0',
						'underscore': 'lib/underscore/underscore-amd-min',
						'underscore.string': 'lib/underscore/underscore.string.min',
						'knockout':'lib/knockout/knockout-2.2.1',
						'mousetrap':'lib/mousetrap/mousetrap.min',
						'hammer':'lib/hammer/hammer.min',
						'text': 'lib/require/text'
					},
					name:'main'
				}
			},
		},
		clean:{
			build:["build/build.txt",'build/img/*.ai']
		}
	});
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-replace');
	grunt.registerTask('build',['requirejs','clean']);
}
