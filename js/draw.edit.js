define([
	'knockout','underscore','draw',
	'tool/base','lib/knockout/svgtemplate'
],function(ko,_,Draw,baseTool,svgTemplate){
	var pause = ko.observable(false),
		focus = ko.observable(),
		selection = ko.observableArray([]),
		selected = ko.computed(function(){
			if(!pause())
				return _(selection()).map(function(shape){
					var b = shape.bbox(),
						r = shape.rotate(),
						w = shape.stroke()!='none' ? 
							shape.strokeWidth()*Draw.zoom():0,
						o = Draw.toView(b,'_selected');
					o.transform = 'rotate('+r+' '
						+(o.x+o.width/2)+','+(o.y+o.height/2)+')';
					o.x -= w/2 + 1; o.y -= w/2 + 1;
					o.width += w + 2; o.height += w + 2;
					return o;
				});
		}).extend({throttle:1}),

		options = {
			fill: ko.observable('red'),
			stroke: ko.observable('black'),
			strokeWidth: ko.observable(2),
			strokeLinecap: ko.observable('round')
		},

		controls = ko.observableArray(),
		controlsTemplate = svgTemplate(controls,function(control){
			if(!(control && 'view' in control)) return '';
			return control.view;
		}),

		tool = ko.observable(),
		tools = ko.observableArray(),
		toolTemplate = svgTemplate(tool,function(tool){
			if(!(tool && 'view' in tool)) return '';
			return tool.view;
		}),

		trigger = (function(){
			var active, delay, 
				timeout = _.debounce(function(){
					delay = false;
				},250);
			return function(type,e){
				if(type.match(/touch|wheel/) && !delay){
					active = _(controls()).find(function(t){
						return ('check' in t) && t.check(e.target);
					}) || tool();
					delay = true;
				} 
				if(type=='touch'){
					delay = false;
				}else if(type=='wheel')
					timeout();

				if(type.match(/start/)) pause(true);
				if(type == 'release') pause(false);

				if(active && _.isFunction(active[type]))
					active[type](e);
				else if(_.isFunction(baseTool[type]))
					baseTool[type](e);
			};
		})();

	selection.subscribe(function(shapes){
		//capture selection options
		if(shapes.length == 1){
			var shape = shapes[0];
			_(options).each(function(option, key){
				if(key in shape && shape[key]()!='none')
					option(shape[key]());
			});
		}
	});

	_(options).each(function(option,key){
		option.subscribe(function(val){
			//on option change apply to selection
			_(selection()).each(function(shape){
				if(key in shape) shape[key](val);
			});
		});
	});


	_(Draw).extend({
		selection: selection,
		selected: selected,
		trigger:trigger,

		options:options,
		tools:tools,
		tool: tool, 
		toolTemplate:toolTemplate,

		controls:controls,
		controlsTemplate:controlsTemplate
	});

});
