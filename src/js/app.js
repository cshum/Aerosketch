require.config({
	paths: {
		'jquery': 'lib/jquery/jquery-1.9.0',
		'underscore': 'lib/underscore/underscore-amd-min',
		'underscore.string': 'lib/underscore/underscore.string.min',
		'knockout':'lib/knockout/knockout-2.2.1',
		'mousetrap':'lib/mousetrap/mousetrap.min',
		'hammer':'lib/hammer/hammer.min',
		'text': 'lib/require/text'
	},
	waitSeconds: 900,
	baseUrl:'js',
	urlArgs: location.hostname=='localhost' ? (new Date()).getTime() : null
});


require([
	'knockout','jquery','mousetrap','util/parseparams',

	'control/base', 'control/selected', 'control/strokesize',
	'tool/pointer', 'tool/hand', 'tool/freehand',
	'tool/path', 'tool/ellipse', 'tool/rect',

	'draw','draw.palette','draw.clipboard',
	'draw.momento','draw.options','draw.firebase',

	'binding/surface','binding/hammer',
	'binding/palette','binding/aniattr'
],function(
	ko,$,Mousetrap,parseParams,
	baseCtrl, selectedCtrl, strokeCtrl,
	pointerTool, handTool, freehandTool, 
	pathTool, ellipseTool, rectTool,
	Draw){

	//init controls
	Draw.controls([strokeCtrl, selectedCtrl]);
	Draw.baseControl(baseCtrl);

	//init tools
	Draw.tools([
	   pointerTool,handTool, freehandTool, 
	   pathTool, ellipseTool, rectTool
	]);
	Draw.tool(freehandTool);

	//Parse id
	var params = parseParams(location.href), id;
	if(params && params.s){
		id = params.s;
	}else{
		id = Draw.create(), uri = '?s='+id;
		if(window.history.pushState)
			window.history.pushState(null,null,uri);
	}

	Draw.load(id,function(bbox){
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

  //Keyboard shortcuts
  Mousetrap.bind(['command+z', 'ctrl+z'], Draw.undo);
  Mousetrap.bind(['command+shift+z','command+y', 'ctrl+y'], Draw.redo);
  Mousetrap.bind(['command+x', 'ctrl+x'], Draw.cut);
  Mousetrap.bind(['command+c', 'ctrl+c'], Draw.copy);
  Mousetrap.bind(['command+v', 'ctrl+v'], Draw.paste);
  

	//prevent defaults
	var prevent = function(e) { e.preventDefault(); };
	document.ontouchstart = prevent;
	document.oncontextmenu = prevent;
	document.ontouchmove = prevent;
});
