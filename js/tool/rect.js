define(['knockout','draw','text!view/ratio.html'
],function(ko,Draw,toolbarView){
	if(!ko) return;
	var shape, lock = ko.observable(false);
	function start(e){
		var start = Draw.fromView(e.start);
		shape = Draw.layer().newShape('rect');
		shape.set(Draw.options);
		shape.x(start.x);
		shape.y(start.y);
	}
	function drag(e){
		var dx = e.distanceX/Draw.zoom(),
			dy = e.distanceY/Draw.zoom(),
			start = Draw.fromView(e.start);
		if(lock()){
			var d = Math.max(Math.abs(dx), Math.abs(dy));
			shape.x(start.x + (dx > 0 ? 0:-d));
			shape.y(start.y + (dy > 0 ? 0:-d));
			shape.width(d);
			shape.height(d);
		}else{
			shape.x(start.x+Math.min(dx,0));
			shape.y(start.y+Math.min(dy,0));
			shape.width(Math.abs(dx));
			shape.height(Math.abs(dy));
		}
	}
	function release(){
		if(shape)
			Draw.save(shape);
		shape = null;
	}
	return {
		name:'Rectangle',
		iconView: '<span class="draw-icon-square"></span>',
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
