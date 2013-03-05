define([
   'knockout','underscore','transform',
   'draw','draw.momento'
],function(ko,_,Transform,Draw){
	var clipboard = ko.observableArray([]),
		hide = function(){
			var shapes = Draw.selection();
			_(shapes).invoke('visible',false);
			Draw.selection.removeAll();
			Draw.save.apply(null,shapes);
		},
		copy = function(){
			clipboard( _(Draw.selection()).map(function(shape){
				return shape.clone();
			}) );
		},
		cut = function(){
			copy();
			hide();
		},
		paste = function(){
			if(!clipboard()) return;

			var shapes = _(clipboard()).map(function(shape){
				var clone = Draw.layer().newShape(shape.type);
				clone.set(shape);
				return clone;
			});

			Transform(shapes,{translate:{
				x:30/Draw.zoom(),
				y:30/Draw.zoom()
			}});

			Draw.save.apply(null,shapes);
			Draw.selection(shapes);
		};

	_(Draw).extend({
		clipboard:clipboard,
		hide:hide,
		cut:cut,
		copy:copy,
		paste:paste
	});

});
