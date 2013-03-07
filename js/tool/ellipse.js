define([
	'knockout','draw','text!view/ratio.html'
],function(ko,Draw,toolbarView){
	if(!ko) return;
	var shape, lock = ko.observable(false);
	function start(e){
		var start = Draw.fromView(e.start);
		shape = Draw.layer().newShape(lock() ? 'circle':'ellipse');
		shape.set(Draw.options);
		shape.cx(start.x);
		shape.cy(start.y);
	}
	function drag(e){
		var start = Draw.fromView(e.start),
			pos = Draw.fromView(e.position);
		if(lock()){
			shape.r(Draw.round(e.distance/Draw.zoom()/2));
			shape.cx(Draw.round((start.x + pos.x)/2));
			shape.cy(Draw.round((start.y + pos.y)/2));
		}else{
			var hx = e.distanceX/Draw.zoom()/2,
				hy = e.distanceY/Draw.zoom()/2;
			shape.rx(Draw.round(Math.abs(hx)));
			shape.ry(Draw.round(Math.abs(hy)));
			shape.cx(Draw.round(start.x + hx));
			shape.cy(Draw.round(start.y + hy));
		}
	}
	function release(){
		if(shape){
			Draw.save(shape);
		}
		shape = null;
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
