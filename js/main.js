require.config({
	shim: {
		'firebase': {exports:'Firebase'}
	},
	paths: {
		'jquery': 'lib/jquery/jquery-1.9.0',
		'underscore': 'lib/underscore/underscore-amd-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'lib/knockout/knockout-2.2.1',
		'mousetrap':'lib/mousetrap/mousetrap.min',
		'hammer':'lib/hammer/hammer.min',
		'text': 'lib/require/text',

		'firebase':'http://static.firebase.com/v0/firebase'
	},
	urlArgs: location.hostname == 'localhost' ?
		"bust=" +  (new Date()).getTime() : ''
});


require([
	'knockout','jquery',

	'control/base', 'control/selected', 'control/strokeSize',
	'tool/pointer', 'tool/hand', 'tool/freehand',
	'tool/path', 'tool/ellipse', 'tool/rect',

	'draw','draw.palette','draw.clipboard',
	'draw.momento','draw.options','draw.firebase',

	'binding/surface','binding/hammer',
	'binding/palette','binding/aniattr'
],function(
	ko,$,
	baseCtrl, selectedCtrl, strokeCtrl,
	pointerTool, handTool, freehandTool, 
	pathTool, ellipseTool, rectTool,
	Draw
){

	//init controls
	Draw.controls([selectedCtrl, strokeCtrl]);
	Draw.baseControl(baseCtrl);

	//init tools
	Draw.tools([
	   pointerTool,handTool, freehandTool, 
	   pathTool, ellipseTool, rectTool
	]);
	Draw.tool(freehandTool);

	if(!ko) return;
	Draw.firebase('https://aerosketch.firebaseio.com/',function(bbox){
		ko.applyBindings(Draw,document.body);

		//zoom to overview
		if(bbox && bbox.width>0 && bbox.height>0){
			var w = $('#surface').width(),
				h = $('#surface').height();
			Draw.zoom(Math.min(w/bbox.width, h/bbox.height, 1));
			Draw.position({
				x:bbox.x*Draw.zoom() - (w - bbox.width*Draw.zoom())/2,
				y:bbox.y*Draw.zoom() - (h - bbox.height*Draw.zoom())/2
			});
		}
	});

	//prevent defaults
	var prevent = function(e) { e.preventDefault(); };
	document.ontouchstart = prevent;
	document.oncontextmenu = prevent;
	document.ontouchmove = prevent;
});
