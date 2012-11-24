define(['draw'],function(Draw){
	var p;
	function start(){
		p = Draw.position();
	}
	function drag(e){
		Draw.position({
			x:p.x - e.distanceX,
			y: p.y - e.distanceY
		});
	}
	return {
		name:'Hand Tool',
		iconView: '<span class="draw-icon-hand"></span>',
		dragstart:start,
		drag:drag
	};
});
