define([
	'underscore','knockout','draw',
	'util/requestanimationframe'
],function(_,ko,Draw,aniFrame){
	var point, last, w2,
		shape, cursor, following,
		dist2 = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return (dx*dx + dy*dy);
		},
		start = function(e){
			if(Draw.options.stroke()=='none')
				Draw.options.stroke('black');

			var s = Draw.fromView(e.start),
				p = Draw.fromView(e.position);
			shape = Draw.layer().newShape('path');
			shape.set(Draw.options);
			shape.fill('none');
			shape.moveTo(s);
			shape.lineTo(s);

			cursor = p;
			point = p;
			last = s;

			following = true;
			w2 = Math.pow(Draw.options.strokeWidth()/2,2);
			follow();
		},
		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			if(!following) return;
			shape.back();
			/*
			point = {
				x: Draw.round((point.x + cursor.x)/2),
				y: Draw.round((point.y + cursor.y)/2)
			};
			*/
		   point = cursor;
			
			   //(!center || dist2Seg2(last,center,point) >= Math.pow(0.1/Draw.zoom(),2))){
			if(dist2(last,point) >= w2){
				center = {
					x: (point.x + last.x)/2,
					y: (point.y + last.y)/2
				};
				shape.qCurveTo(last,center);
				last = point;
			}
			shape.lineTo(point);

			if(following)  aniFrame(follow);
		},
		release = function(){
			if(shape) Draw.save(shape);
			following = false;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',
		dragstart:start,
		drag:drag,
		release:release
	};
});
