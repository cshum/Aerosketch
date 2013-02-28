define([
   'underscore','knockout',
   'draw','draw.momento'
],function(_,ko,Draw){
	var changed = false,
		options = {
			fill: ko.observable('red'),
			stroke: ko.observable('black'),
			strokeWidth: ko.observable(2)
		};

	_(options).each(function(option,key){
		option.subscribe(function(val){
			//on option change apply to selection
			_(Draw.selection()).each(function(shape){
				changed = true;
				if(key in shape) shape[key](val);
			});
		});
	});
	function capture(){
		var shapes = Draw.selection();
		if(shapes.length==1){
			var shape = shapes[0];
			_(options).each(function(option, key){
				if(key in shape && shape[key]()!='none')
					option(shape[key]());
			});
		}
	}
	Draw.debounce.subscribe(function(val){
		if (!val && changed) {
			Draw.save.apply(null,Draw.selection());
			changed = false;
		}
		if(!val) _.defer(capture);
	});
	Draw.selection.subscribe(capture);

	_(Draw).extend({
		options:options
	});
});
