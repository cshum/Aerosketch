define([
   'knockout','underscore','transform',
   'draw','util/requestanimationframe','draw.momento'
],function(ko,_,Transform,Draw,aniFrame){
	var clipboard = ko.observableArray([]),
		hide = function(){
			var shapes = Draw.selection().slice(0);
			Draw.selection.removeAll();
			_(shapes).invoke('visible',false);
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

			aniFrame(function(){
				Draw.selection(shapes);
				Draw.save.apply(null,shapes);
			});
		};

	_(Draw).extend({
		clipboard:clipboard,
		hide:hide,
		cut:cut,
		copy:copy,
		paste:paste
	});

});
