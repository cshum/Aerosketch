define([
	'underscore','knockout','draw','util/requestanimationframe'
],function(_,ko,Draw,aniFrame){
	var point, center, curr, last, prev,
		shape, cursor, following,
		distance = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
		},
		perpDistance = function(p0,p1,p){
		},

		start = function(e){
			if(Draw.options.stroke()=='none')
				Draw.options.stroke('black');

			var s = Draw.fromView(e.start);
			shape = Draw.layer().newShape('path');
			shape.set(Draw.options);
			shape.fill('none');
			shape.moveTo(s);
			shape.lineTo(s);

			cursor = s;
			point = s;
			prev = s;
			center = s;
			last = s;
			following = true;
			follow();
		},
		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			if(!following) return;
			shape.back();
			point = {
				x: Draw.round(point.x*0.5 + cursor.x*0.5),
				y: Draw.round(point.y*0.5 + cursor.y*0.5)
			};

			var d = distance(center, point);
			if(d >= Draw.options.strokeWidth()){
				/*
				shape.qCurveTo(center,{
					x: (point.x + center.x)/2,
					y: (point.y + center.y)/2
				});
				*/
			   shape.lineTo(point);
				last = center;
				center = point;
			}
			shape.lineTo(point);
			prev = point;

			if(following)  aniFrame(follow);
		},
		release = function(){
			following = false;
			Draw.save(shape);
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',
		dragstart:start,
		drag:drag,
		release:release
	};
});
