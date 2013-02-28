define(['knockout','draw','text!view/ratio.html'
],function(ko,Draw,toolbarView){
	var curr, lock = ko.observable(false);
	function start(e){
		var start = Draw.fromView(e.start);
		curr = Draw.layer().newShape('rect');
		curr.update(Draw.options);
		curr.x(start.x);
		curr.y(start.y);
		Draw.layer().shapes.push(curr);
	}
	function drag(e){
		var dx = e.distanceX/Draw.zoom(),
			dy = e.distanceY/Draw.zoom(),
			start = Draw.fromView(e.start);
		if(lock()){
			var d = Math.max(Math.abs(dx), Math.abs(dy));
			curr.x(start.x + (dx > 0 ? 0:-d));
			curr.y(start.y + (dy > 0 ? 0:-d));
			curr.width(d);
			curr.height(d);
		}else{
			curr.x(start.x+Math.min(dx,0));
			curr.y(start.y+Math.min(dy,0));
			curr.width(Math.abs(dx));
			curr.height(Math.abs(dy));
		}
	}
	function release(){
		if(curr)
			Draw.commit(curr);
		curr = null;
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
