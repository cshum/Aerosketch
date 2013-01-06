define(['knockout','underscore','transform','draw'
],function(ko,_,Transform,Draw){
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

			Transform.on(shapes);
			Transform.set({translate:{
				x:30/Draw.zoom(),
				y:30/Draw.zoom()
			}});

			Draw.add.apply(null,shapes);
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
