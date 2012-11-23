define(['draw'],function(Draw){
	var scale, pos;
	function tap(e){
		if(e.target._shape)
			Draw.select(e.target);
	}
	function wheel(e){
		var p = Draw.position(),
			o = e.position;
		Draw.position({
			x: p.x + e.delta*o.x*Draw.zoom(),
			y: p.y + e.delta*o.y*Draw.zoom()
		});
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	function transformstart(e){
		scale = Draw.zoom();
		pos = Draw.position();
	}
	function transform(e){
		Draw.position({
			x:pos.x + ((e.scale - 1)*e.position.x
			- e.distanceX)*Draw.zoom(),
			y:pos.y + ((e.scale - 1)*e.position.y
			- e.distanceY)*Draw.zoom()
		});
		Draw.zoom(scale*e.scale);
	}
	return {
		tap:tap,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
