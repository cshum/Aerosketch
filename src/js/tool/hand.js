define(['draw'],function(Draw){
	var p, changed;
	function start(){
		p = Draw.position();
		Draw.transforming(true);
		changed = true;
	}
	function drag(e){
		Draw.position({
			x: Draw.round(p.x - e.distanceX),
			y: Draw.round(p.y - e.distanceY)
		});
	}
	Draw.debounce.subscribe(function(){
		if(changed) Draw.transforming(false);
		changed = false;
	});
	return {
		name:'Hand Tool',
		iconView: '<span class="draw-icon-hand"></span>',
		dragstart:start,
		drag:drag
	};
});
