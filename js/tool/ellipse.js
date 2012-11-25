define([
	'knockout','shape/ellipse','shape/circle',
	'draw','text!view/ratio.html'
],function(ko,Ellipse,Circle,Draw,toolbarView){
	var curr, lock = ko.observable(false);
	function start(e){
		var start = Draw.fromView(e.start);
		curr = new (lock() ? Circle:Ellipse)(Draw.options);
		curr.cx(start.x);
		curr.cy(start.y);
		Draw.add(curr);
	}
	function drag(e){
		var start = Draw.fromView(e.start),
			pos = Draw.fromView(e.position);
		if(lock()){
			curr.r(e.distance/Draw.zoom()/2);
			curr.cx((start.x + pos.x)/2);
			curr.cy((start.y + pos.y)/2);
		}else{
			var hx = e.distanceX/Draw.zoom()/2,
				hy = e.distanceY/Draw.zoom()/2;
			curr.rx(Math.abs(hx));
			curr.ry(Math.abs(hy));
			curr.cx(start.x + hx);
			curr.cy(start.y + hy);
		}
	}
	function release(){
		if(curr){
		}
		curr = null;
	}
	return {
		name:'Ellipse',
		iconView: '<span class="draw-icon-circle"></span>',
		toolbarView:toolbarView,

		dragstart:start,
		drag:drag,
		release:release,
		off:release,

		lock:lock,
		toggleLock: function(){
			lock(!lock());
		}
	};
});
