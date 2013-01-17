define([
   'underscore','knockout','record/shape',
   'draw','draw.commit'
],function(_,ko,Record,Draw){
	var changed = false,
		options = {
			fill: ko.observable('red'),
			stroke: ko.observable('black'),
			strokeWidth: ko.observable(2),
			strokeLinecap: ko.observable('round')
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
	Draw.debounce.subscribe(function(val){
		if (!val && changed) {
			Draw.commit.apply(null,
				_(Draw.selection()).map(function(shape){
					return new Record(shape);
				}
			));
			changed = false;
		}
		_.defer(Draw.selection.valueHasMutated); 
		//trigger selection
	});
	Draw.selection.subscribe(function(shapes){
		//capture selection options
		if(shapes.length == 1){
			var shape = shapes[0];
			_(options).each(function(option, key){
				if(key in shape && shape[key]()!='none')
					option(shape[key]());
			});
		}
	});
	_(Draw).extend({
		options:options
	});
});
