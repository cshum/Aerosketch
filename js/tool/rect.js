define(['shape/rect','draw'],function(Rect,Draw){
	var curr;
	function start(e){
		if(curr) finish();
		curr = new Rect(Draw.options);
		curr.x(e.start.x);
		curr.y(e.start.y);
		Draw.add(curr);
	}
	function drag(e){
		if(e.shiftKey || e.button==2){
			var d = Math.max(
				Math.abs(e.distanceX), 
				Math.abs(e.distanceY)
			);
			curr.x(e.start.x + (e.distanceX > 0 ? 0:-d));
			curr.y(e.start.y + (e.distanceY > 0 ? 0:-d));
			curr.width(d);
			curr.height(d);
		}else{
			var dx = e.distanceX,
				dy = e.distanceY;
			curr.x(e.start.x+Math.min(dx,0));
			curr.y(e.start.y+Math.min(dy,0));
			curr.width(Math.abs(dx));
			curr.height(Math.abs(dy));
		}
	}
	function finish(){
		if(curr){
		}
		curr = null;
	}
	function select(e){
		if(e.target._shape)
			Draw.selection([e.target]);
	}
	return {
		name:'Rectangle',
		iconView: '<span class="draw-icon-square"></span>',

		dragstart:start,
		drag:drag,
		release:finish,
		close:finish,

		tap:select
	};
});
