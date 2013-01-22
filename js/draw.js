define([
	'knockout','underscore',
	'lib/knockout/template',
	'lib/knockout/svgtemplate',
],function(ko,_,template,svgTemplate){
	var layers = ko.observableArray(),
		layer = ko.observable(),

		round = function(num){
			var pow = Math.ceil(Math.log(zoom()) / Math.LN10);
			return parseFloat(num.toFixed(Math.max(1,pow)));
		},
		toView = function(b,label){
			b = ko.utils.unwrapObservable(b); 
			if(!b) return;
			var p = position(), z = zoom(), o = {};
			if('x' in b) o.x = (b.x*z - p.x); 
			if('y' in b) o.y = (b.y*z - p.y);
			if('width' in b) o.width = b.width*z;
			if('height' in b) o.height = b.height*z;
			if(label) o[label] = true;
			return o;
		},
		fromView = function(b,label){
			b = ko.utils.unwrapObservable(b);
			if(!b) return;
			var p = position(), z = zoom(), o = {};
			if('x' in b) o.x = round((p.x + b.x)/z); 
			if('y' in b) o.y = round((p.y + b.y)/z);
			if('width' in b) o.width = round(b.width/z);
			if('height' in b) o.height = round(b.height/z);
			if(label) o[label] = true;
			return o;
		},
		add = function(){
			layer().shapes.push.apply(
				layer().shapes,arguments);
		},

		position = ko.observable({x:0,y:0}),
		zoom = ko.observable(1),
		background = ko.observable('white'),
		transform = ko.computed(function(){
			var p = position(),
				z = zoom();
			return 'translate('+(-p.x)+' '+(-p.y)+') scale('+z+')';
		}),

		selection = ko.observableArray([]),
		deselect = function(){
			selection.removeAll();
		},
		select = function(){
			selection(_(arguments).toArray());
		},

		controls = ko.observableArray(),
		controlsTemplate = svgTemplate(ko.computed(function(){
			return controls.slice(0).reverse();
		}),function(control){
			return (control && control.view) ? control.view:'';
		}),
		baseControl = ko.observable(),

		tool = function(){
			var tool = ko.observable();
			return ko.computed({
				read:tool, write: function(val){
					if(tool() && tool().off) tool().off();
					tool(val);
					if(tool() && tool().on) tool().on();
				}
			});
		}(),
		tools = ko.observableArray(),
		toolTemplate = svgTemplate(tool,function(tool){
			return (tool && tool.view) ? tool.view:'';
		}),
		toolbarTemplate = template(tool,function(tool){
			return (tool && tool.toolbarView) ? tool.toolbarView: '';
		}),

		debounce = ko.observable(false),
		trigger = (function(){
			var active, timeout;
			return function(type,e){
				function check(t){
					return ('check' in t) && 
						t.check(ko.dataFor(e.target));
				}
				if(type.match(/touch|wheel/) && !debounce()){
					active = check(tool()) ? tool() :
					_(controls()).find(check) || tool();
					debounce(true);
				} 
				if(type=='release'){
					debounce(false);
				}else if(type=='wheel'){
					clearTimeout(timeout);
					timeout = setTimeout(debounce,250,false);
				}else if(type.match(/start/)){
					clearTimeout(timeout);
				}

				if(active && _.isFunction(active[type]))
					active[type](e);
				else if(baseControl() && _.isFunction(baseControl()[type]))
					baseControl()[type](e);
			};
		})();

	return {
		layers: layers,
		layer: layer,

		round:round,
		fromView:fromView,
		toView:toView,

		zoom:zoom, 
		position:position,
		transform:transform,

		background:background,
		add:add,

		selection: selection,
		select: select,
		deselect: deselect,
		trigger:trigger,
		debounce:debounce,

		tools:tools,
		tool: tool, 
		toolTemplate:toolTemplate,

		toolbarTemplate:toolbarTemplate,

		controls:controls,
		baseControl:baseControl,
		controlsTemplate:controlsTemplate
	};
});
