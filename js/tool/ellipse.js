define(['shape/ellipse','draw'],function(Ellipse,Draw){
	var curr;
	function start(e){
		if(curr) finish();
		curr = new Ellipse(Draw.options);
		curr.cx(e.start.x);
		curr.cy(e.start.y);
		Draw.add(curr);
	}
	function drag(e){
		if(e.shiftKey || e.button==2){
			curr.rx(e.distance/2);
			curr.ry(e.distance/2);
			curr.cx((e.start.x + e.position.x)/2);
			curr.cy((e.start.y + e.position.y)/2);
		}else{
			var hx = e.distanceX/2,
				hy = e.distanceY/2;
			curr.rx(Math.abs(hx));
			curr.ry(Math.abs(hy));
			curr.cx(e.start.x + hx);
			curr.cy(e.start.y + hy);
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
		name:'Ellipse',
		iconView: '<span class="draw-icon-circle"></span>',

		dragstart:start,
		drag:drag,
		release:finish,
		close:finish,

		tap:select
	};
});
