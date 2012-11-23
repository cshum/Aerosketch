define(['draw'],function(Draw){
	var scale, pos;
	function tap(e){
		if(e.target._shape)
			Draw.select(e.target);
	}
	function wheel(e){
		Draw.origin(e.position);
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	function transformstart(e){
		scale = Draw.zoom();
		pos = Draw.position();
	}
	function transform(e){
		Draw.origin(e.position);
		Draw.zoom(scale*e.scale);
		Draw.position({
			x:pos.x - e.distanceX*Draw.zoom(),
			y:pos.y - e.distanceY*Draw.zoom()
		});
	}
	return {
		tap:tap,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
