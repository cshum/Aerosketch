define(['knockout','draw'],function(ko,Draw){
	function tap(e){
		var vm = ko.dataFor(e.target);
		if(vm && vm._shape)
			Draw.select(vm);
	}
	function wheel(e){
		var pos = Draw.position(),
			p = e.position;
		Draw.position({
			x: pos.x + e.delta*(pos.x + p.x),
			y: pos.y + e.delta*(pos.y + p.y)
		});
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	var zoom, pos;
	function transformstart(e){
		zoom = Draw.zoom();
		pos = Draw.position();
	}
	function transform(e){
		if(!(e.scale>0.001 && e.scale<100)) return;
		//todo
		var dx = e.distanceX,
			dy = e.distanceY,
			delta = e.scale - 1,
			p = e.position;
		Draw.position({
			x: pos.x - dx + delta*(pos.x - dx + p.x),
			y: pos.y - dy + delta*(pos.y - dy + p.y)
		});
		Draw.zoom(zoom*e.scale);
	}
	return {
		tap:tap,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
