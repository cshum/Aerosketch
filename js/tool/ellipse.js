define([
	'knockout','shape/ellipse','shape/circle',
	'draw','text!view/ratio.html'
],function(ko,Ellipse,Circle,Draw,toolbarView){
	var curr, lockRatio = ko.observable(false);
	function start(e){
		if(curr) finish();
		curr = new (lockRatio() ? Circle:Ellipse)(Draw.options);
		curr.cx(e.start.x);
		curr.cy(e.start.y);
		Draw.add(curr);
	}
	function drag(e){
		if(lockRatio()){
			curr.r(e.distance/2);
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
	return {
		name:'Ellipse',
		iconView: '<span class="draw-icon-circle"></span>',
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
