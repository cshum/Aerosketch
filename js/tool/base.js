define(['draw'],function(Draw){
	var scale;
	function select(e){
		if(e.target._shape)
			Draw.select(e.target);
	}
	function wheel(e){
		Draw.origin(e.position);
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	function transformstart(e){
		Draw.origin(e.position);
		scale = Draw.zoom();
	}
	function transform(e){
		Draw.zoom(scale*e.scale);
	}
	return {
		tap:select,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
