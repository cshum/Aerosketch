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
			before:["build"],
			after:["build/build.txt"]
		}
	});
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.registerTask('build',['clean:before','requirejs:build','clean:after']);
}
