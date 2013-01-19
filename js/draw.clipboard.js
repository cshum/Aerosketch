define([
   'knockout','underscore','transform',
   'record/shape','draw','draw.commit'
],function(ko,_,Transform,Record,Draw){
	var clipboard = ko.observableArray([]),
		hide = function(){
			_(Draw.selection()).each(function(shape){
				shape.visible(false);
			});
			Draw.selection.removeAll();
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
				return shape.clone();
			});

			Transform(shapes,{translate:{
				x:30/Draw.zoom(),
				y:30/Draw.zoom()
			}});

			Draw.add.apply(null,shapes);
			Draw.commit.apply(null,_(shapes).map(function(shape){
				return new Record(shape);
			}));
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
