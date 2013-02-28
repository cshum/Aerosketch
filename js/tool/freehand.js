define([
	'underscore','knockout','draw',
	'util/requestanimationframe','util/polysimplify'
],function(_,ko,Draw,requestAnimationFrame,polySimplify){
	var points = [], following = false,
		interval, point, cursor, curr,
		smoothen = function(points) {
			var ps = [];
			ps.push(['M',points[0]]);
			if (points.length < 3)
				ps.push(['L',points[1]]);
			else{
				for (i = 1; i < points.length - 2; i++) {
					var c = Draw.round((
							points[i][0] + points[i + 1][0]) / 2),
						d = Draw.round(
							(points[i][1] + points[i + 1][1]) / 2);
					ps.push(['Q',points[i], [c, d]]);
				}
				ps.push(['Q',points[i], points[i + 1]]);
			}
			return ps;
		},
		dist = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
		},

		start = function(e){
			if(Draw.options.stroke()=='none')
				Draw.options.stroke('black');

			var s = Draw.fromView(e.start);
			curr = Draw.layer().newShape('path');
			curr.set(Draw.options);
			curr.fill('none');
			curr.moveTo(s);

			points = [[s.x, s.y]];
			point = s;
			requestAnimationFrame(follow);
			following = true;
		},

		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			var d = 0.5;
			if(dist(cursor,point) >= 5/Draw.zoom()){
				point = {
					x: Draw.round(point.x*(1-d) + cursor.x*d),
					y: Draw.round(point.y*(1-d) + cursor.y*d)
				};
				points.push([point.x,point.y]);
				curr.lineTo(point);
			}
			if(following) requestAnimationFrame(follow);
			else curr = null;
		},
		release = function(){
			points.push([cursor.x,cursor.y]);
			curr.path(smoothen(polySimplify(points,0.1/Draw.zoom())));
			Draw.save(curr);
			points = [];
			following = false;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',
		dragstart:start,
		drag:drag,
		tap:function(){},
		release:release
	};
});
