define(['knockout','shape/rect','draw','text!view/ratio.html'
],function(ko,Rect,Draw,toolbarView){
	var curr, lockRatio = ko.observable(false);
	function start(e){
		if(curr) finish();
		curr = new Rect(Draw.options);
		curr.x(e.start.x);
		curr.y(e.start.y);
		Draw.add(curr);
	}
	function drag(e){
		if(lockRatio()){
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
	return {
		name:'Rectangle',
		iconView: '<span class="draw-icon-square"></span>',
		toolbarView:toolbarView,

		dragstart:start,
		drag:drag,
		release:finish,
		close:finish,

		lockRatio:lockRatio,
		toggleRatio: function(){
			lockRatio(!lockRatio());
		}
	};
});
