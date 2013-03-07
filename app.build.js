({
	appDir:'.',
	dir:'public',
	baseUrl:'js',
	paths: {
		'underscore': 'lib/underscore/underscore-amd-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'hammer':'lib/hammer/hammer.min',
		'jquery': 'empty:',
		'knockout':'empty:',
		'mousetrap':'empty:',
		'firebase':'empty:',

		'text': 'lib/require/text',

	},
	modules:[ {name:'main'} ]
})
