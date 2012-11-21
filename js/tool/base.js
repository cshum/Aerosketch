define(['draw'],function(Draw){
	function select(e){
		if(e.target._shape)
			Draw.selection([e.target]);
	}
	function wheel(e){
		Draw.origin(e.position);
		Draw.zoom(Draw.zoom()*(1+e.delta));
	}
	function transformstart(e){
		Draw.origin(e.position);
	}
	function transform(e){
		Draw.zoom(Draw.zoom()*e.scale);
	}
	return {
		tap:select,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
