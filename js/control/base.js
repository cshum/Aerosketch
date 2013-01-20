define(['knockout','underscore','draw','util/points'],function(ko,_,Draw,points){
	var zoom, position, scale, changed = false;
	function select(e){
		var vm = ko.dataFor(e.target);
		if(vm && vm._shape)
			Draw.select(vm);
	}
	function start (){
		scale = 1;
		zoom = Draw.zoom();
		position = Draw.position();
	}
	function wheel(e){
		if(!changed) start();			
		scale *= 1 +e.delta;
		Draw.buffer({
			origin:e.position,
			scale:scale
		});
		changed = true;
	}
	function transform(e){
		Draw.buffer({
			origin:e.position,
			scale:e.scale,
			translate:{
				x:e.distanceX,
				y:e.distanceY
			}
		});
		changed = true;
	}
	Draw.debounce.subscribe(function(val){
		if(!val && changed){
			var e = _(Draw.buffer()).defaults({
				translate:{x:0,y:0},scale:1,origin:{x:0,y:0}
			});
			Draw.zoom(zoom*e.scale);
			Draw.position({
				x: Draw.round(position.x - e.translate.x + (e.origin.x + position.x)*(e.scale -1)),
				y: Draw.round(position.y - e.translate.y + (e.origin.y + position.y)*(e.scale -1))
			});
			Draw.buffer({scale:1, translate:{x:0,y:0}});
		}
		changed = false;
	});

	return {
		tap:select,
		hold:select,
		wheel:wheel,
		transformstart:start,
		transform:transform
	};
});
