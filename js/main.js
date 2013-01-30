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
		'bootstrap':['jquery'],
		'sprite3d': {exports:'Sprite3D'}
	},
	paths: {
		'jquery': 'lib/jquery/jquery-1.9.0',
		'jquery.scrollto': 'lib/jquery/jquery.scrollTo.min',
		'underscore': 'lib/underscore/underscore-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'lib/knockout/knockout-2.2.1',
		'mousetrap':'lib/mousetrap/mousetrap.min',
		'hammer':'lib/hammer/hammer',
		//'sprite3d':'lib/sprite3D/Sprite3D',

		'bootstrap':'lib/bootstrap/bootstrap.min',

		'text': 'lib/require/text',
		'domready': 'lib/require/domready'
	},
	waitSeconds: 900,
	urlArgs: location.hostname == 'localhost' ?
		"bust=" +  (new Date()).getTime() : 255555
});


require([
	'knockout',

	'draw','draw.palette','draw.clipboard','draw.save',
	'draw.controls!base|strokesize,selected',
	'draw.tools!freehand|pointer,hand,freehand,path,ellipse,rect',

	'binding/surface','binding/hammer',
	'binding/palette','binding/aniattr'
],function(ko,Draw){
	ko.applyBindings(Draw,document.body);
});
