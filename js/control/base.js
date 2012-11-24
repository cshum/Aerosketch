define(['draw'],function(Draw){
	function tap(e){
		if(e.target._shape)
			Draw.select(e.target);
	}
	function wheel(e){
		var dp = Draw.position(),
			p = Draw.fromView(e.position);
		Draw.position({
			x: dp.x + e.delta*p.x*Draw.zoom(),
			y: dp.y + e.delta*p.y*Draw.zoom()
		});
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	var zoom, pos;
	function transformstart(e){
		zoom = Draw.zoom();
		pos = Draw.position();
	}
	function transform(e){
		//todo
		var dx = e.distanceX,
			dy = e.distanceY,
			delta = e.scale - 1,
			p = e.position;
		Draw.position({
			x: pos.x + delta*(pos.x + p.x) - dx,
			y: pos.y + delta*(pos.y + p.y) - dy
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
