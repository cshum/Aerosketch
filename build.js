({
	appDir:'../draw',
	dir:'../draw.build',
	baseUrl:'js',
	paths: {
		'jquery': 'empty:',
		'underscore': 'lib/underscore/underscore-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'empty:',
		'mousetrap':'empty:',
		'hammer':'empty:',
		'util/kotemplate':'empty:',
		'util/kosvgtemplate':'empty:',

		'text': 'lib/require/text',

		'firebase':'empty:'
	},
	modules:[
		{name:'main', exclude:['knockout','jquery','firebase'] }
	]
})
