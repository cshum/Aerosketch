define(['draw'],function(Draw){
	var initScale;
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
		initScale = Draw.zoom();
	}
	function transform(e){
		Draw.zoom(initScale*e.scale);
	}
	return {
		tap:select,
		wheel:wheel,
		transformstart:transformstart,
		transform:transform
	}
});
