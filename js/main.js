require.config({
	shim: {
		'underscore': {
			exports: '_',
			deps:['underscore.string'],
			init: function(_s){
				_.mixin(_s.exports());
			}
		},
		'hammer': {exports: 'Hammer'},
		'jquery.scrollto': ['jquery'],
		'bootstrap':['jquery']
	},
	paths: {
		'jquery': 'lib/jquery/jquery-1.8.2.min',
		'jquery.scrollto': 'lib/jquery/jquery.scrollTo.min',
		'underscore': 'lib/underscore/underscore-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'lib/knockout/knockout-2.2.1',
		'mousetrap':'lib/mousetrap/mousetrap.min',
		'hammer':'lib/hammer/hammer',

		'bootstrap':'lib/bootstrap/bootstrap.min',

		'text': 'lib/require/text',
		'domready': 'lib/require/domready'
	},
	waitSeconds: 90,
	urlArgs:(new Date()).getTime()
});


require([
	'knockout',

	'draw','draw.palette','draw.clipboard',
	'draw.controls!base|strokesize,selected',
	'draw.tools!freehand|pointer,hand,freehand,path,ellipse,rect',

	'binding/surface','binding/hammer',
	'binding/palette','binding/aniattr'
],function(ko,Draw){
	ko.applyBindings(Draw,document.body);
	window.Draw = Draw;
});
