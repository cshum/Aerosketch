define([
	'underscore','knockout','draw',
	'util/requestanimationframe',
	'util/dist2segment'
],function(_,ko,Draw,aniFrame,dist2Seg){
	var point, last, center, i,j,
		shape, cursor, following,
		dist = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
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
			center = null;

			i=0;
			j=0;

			following = true;
			follow();
		},
		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			if(!following) return;
			shape.back();
			var p = {
				x: Draw.round(point.x*0.5 + cursor.x*0.5),
				y: Draw.round(point.y*0.5 + cursor.y*0.5)
			};
			if(dist(last,point) >= Draw.options.strokeWidth() && 
			(!center || dist2Seg(last,center,p) >= 0.01/Draw.zoom())){
				center = {
					x: (point.x + last.x)/2,
					y: (point.y + last.y)/2
				};
				i++;
				shape.qCurveTo(last,center);
				last = point;
			}
			shape.lineTo(point);
			point = p;
			j++;

			if(following)  aniFrame(follow);
		},
		release = function(){
			following = false;
			console.log(i,j);
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
