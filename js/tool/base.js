define(['draw'],function(Draw){
	function tap(e){
		if(e.target._shape)
			Draw.select(e.target);
	}
	function wheel(e){
		var pos = Draw.position();
		Draw.position({
			x: pos.x + e.delta*e.position.x*Draw.zoom(),
			y: pos.y + e.delta*e.position.y*Draw.zoom()
		});
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	var zoom, pos;
	function transformstart(e){
		zoom = Draw.zoom();
		pos = Draw.position();
	}
	function transform(e){
		Draw.position({
			x:pos.x + ((e.scale - 1)*e.position.x
			- e.distanceX)*zoom,
			y:pos.y + ((e.scale - 1)*e.position.y
			- e.distanceY)*zoom
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
