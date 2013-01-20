define(['knockout','sprite3d'],function(ko,Sprite3D){
	ko.bindingHandlers.sprite3d = {
		init: function(el,valueAccessor){
			var stage = Sprite3D.stage(el.offsetParent),
				sprite = Sprite3D.create(el);
			ko.computed(function(){
				var e = ko.toJS(valueAccessor());
				console.log(e);
				if(typeof e !== 'object') return;
				if('origin' in e) sprite.transformOrigin(e.origin.x, e.origin.y);
				if('translate' in e) sprite.move(e.translate.x, e.translate.y);
				if('scale' in e) sprite.scale(e.scale, e.scale);
				sprite.update();
			});
		}
	};
});
