define(['draw'],function(Draw){
	var p;
	function start(){
		p = Draw.position();
	}
	function drag(e){
		Draw.position({
			x:p.x - e.distanceX*Draw.zoom(),
			y: p.y - e.distanceY*Draw.zoom()
		});
	}
	function select(e){
		if(e.target._shape)
			Draw.selection([e.target]);
	}
	return {
		name:'Hand Tool',
		iconView: '<span class="draw-icon-hand"></span>',
		dragstart:start,
		drag:drag,
		tap:select
	};
});
