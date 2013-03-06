require.config({
	shim: {
		'underscore': {
			exports: '_',
			deps:['underscore.string'],
			init: function(_s){
				_.mixin(_s.exports());
			}
		},
		'firebase': {exports:'Firebase'}
	},
	paths: {
		'jquery': 'lib/jquery/jquery-1.9.0',
		'underscore': 'lib/underscore/underscore-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'lib/knockout/knockout-2.2.1',
		'mousetrap':'lib/mousetrap/mousetrap.min',
		'hammer':'lib/hammer/hammer.min',

		'text': 'lib/require/text',

		'firebase':'http://static.firebase.com/v0/firebase'
	},
	waitSeconds: 900,
	urlArgs: location.hostname == 'localhost' ?
		"bust=" +  (new Date()).getTime() : 91
});


require([
	'knockout',

	'draw','draw.palette','draw.clipboard',
	'draw.firebase!https://aerosketch.firebaseio.com/',
	'draw.controls!base|strokesize,selected',
	'draw.tools!freehand|pointer,hand,freehand,path,ellipse,rect',

	'binding/surface','binding/hammer',
	'binding/palette','binding/aniattr'
],function(ko,Draw){
	ko.applyBindings(Draw,document.body);

	var prevent = function(e) { e.preventDefault(); };
	document.ontouchstart = prevent;
	document.oncontextmenu = prevent;
	document.ontouchmove = prevent;
});
