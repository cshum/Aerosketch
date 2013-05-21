module.exports = function(grunt) {
	grunt.initConfig({
		requirejs:{
			build: {
				options:{
					appDir:'src',
					dir:'build',
					baseUrl:'js',
					paths: {
						'jquery': 'lib/jquery/jquery-2.0.0.min',
						'jquery.qrcode':'lib/jquery-qrcode/jquery.qrcode.min',
						'underscore': 'lib/underscore/underscore-amd-min',
						'underscore.string': 'lib/underscore/underscore.string.min',
						'knockout':'lib/knockout/knockout-2.2.1',
						'mousetrap':'lib/mousetrap/mousetrap.min',
						'hammer':'lib/hammer/hammer.min',
						'bootstrap-modal':'lib/bootstrap-modal/bootstrap-modal',
						'bootstrap-modalmanager':'lib/bootstrap-modal/bootstrap-modalmanager',
						'text': 'lib/require/text',
						'gapi':'https://apis.google.com/js/client'
					},
					preserveLicenseComments: false,
					name:'app'
				}
			}
		},
		replace:{
			build:{
				options:{
					variables:{'timestamp': '<%= new Date().getTime() %>'}
				},
				files:[
					{src:['build/index.html'],dest:'build/index.html'},
					{src:['build/app.html'],dest:'build/app.html'}
				]
			}
		},
		clean:{
			build:[
				'build/build.txt','build/img/*.ai'
			]
		}
	});
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.registerTask('less','Optimize Less files',function(){
		require('lessless').optimizeProject('build');
	});
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build',['requirejs','less','replace','clean']);
}
