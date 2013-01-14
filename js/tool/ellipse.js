define([
	'knockout','shape/ellipse','shape/circle',
	'draw','text!view/ratio.html','record/shape'
],function(ko,Ellipse,Circle,Draw,toolbarView,Record){
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
			curr.r(Draw.round(e.distance/Draw.zoom()/2));
			curr.cx(Draw.round((start.x + pos.x)/2));
			curr.cy(Draw.round((start.y + pos.y)/2));
		}else{
			var hx = e.distanceX/Draw.zoom()/2,
				hy = e.distanceY/Draw.zoom()/2;
			curr.rx(Draw.round(Math.abs(hx)));
			curr.ry(Draw.round(Math.abs(hy)));
			curr.cx(Draw.round(start.x + hx));
			curr.cy(Draw.round(start.y + hy));
		}
	}
	function release(){
		if(curr){
			Draw.commit(new Record(curr));
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
