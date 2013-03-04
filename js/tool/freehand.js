define([
	'underscore','knockout','draw'
],function(_,ko,Draw){
	var angle, point, prev, shape,
		dist = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
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
			point = null;
			prev = null;
			angle = null;
		},
		d = 0.5,
		drag = function(e){
			var cursor = Draw.fromView(e.position);
			point = point || cursor;

			shape.back();
			if(dist(cursor,point) >= Draw.options.strokeWidth()){
				point = {
					x: Draw.round(point.x*(1-d) + cursor.x*d),
					y: Draw.round(point.y*(1-d) + cursor.y*d)
				};
				if(prev)
					shape.qCurveTo(prev,{
						x: (point.x + prev.x)/2,
						y: (point.y + prev.y)/2
					});
				prev = point;
			}
			shape.lineTo(cursor);
		},
		release = function(){
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
