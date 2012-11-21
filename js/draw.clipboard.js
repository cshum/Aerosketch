define(['knockout','underscore','transform','draw','draw.edit'
],function(ko,_,Transform,Draw){
	var clipboard,
		hide = function(){
			_(Draw.selection()).each(function(shape){
				shape.visible(false);
			});
			Draw.selection.removeAll();
		},
		copy = function(){
			clipboard = _(Draw.selection()).map(function(shape){
				return shape.clone();
			})
		},
		cut = function(){
			copy();
			hide();
		},
		paste = function(){
			if(!clipboard) return;

			Transform.on(clipboard);
			Transform.set({translate:{x:20,y:20}});

			Draw.add.apply(null,clipboard);
			Draw.selection(clipboard);

			clipboard = _(clipboard).map(function(shape){
				return shape.clone();
			});
		};

	_(Draw).extend({
		hide:hide,
		cut:cut,
		copy:copy,
		paste:paste
	});

});
