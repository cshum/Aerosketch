define(['knockout','underscore','draw','util/points'],function(ko,_,Draw,points){
	var zoom, position, scale, changed = false;
	function Transform(e){
		e = _(e).defaults({
			translate:{x:0,y:0},scale:1,origin:{x:0,y:0}
		});
		Draw.zoom(zoom*e.scale);
		Draw.position({
			x: Draw.round(position.x - e.translate.x + 
			  (e.origin.x - e.translate.x + position.x)*(e.scale -1)),
			y: Draw.round(position.y - e.translate.y + 
			  (e.origin.y - e.translate.y + position.y)*(e.scale -1))
		});
	}
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
		Transform({
			origin:e.position,
			scale:scale
		});
		changed = true;
	}
	function transform(e){
		Transform({
			origin:e.position,
			scale:e.scale,
			translate:{
				x:e.distanceX,
				y:e.distanceY
			}
		});
		changed = true;
	}
	Draw.debounce.subscribe(function(){
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
