define([
	'underscore',
	'shape/path','draw','record/shape',
	'util/requestanimationframe','util/polysimplify'
],function(_,Path,Draw,Record,requestAnimationFrame,polySimplify){
	var points, curr, interval, point, cursor, following,
		smoothen = function(points) {
			var ps = [];
			ps.push(['M',points[0]]);
			if (points.length < 3)
				ps.push(['L',points[1]]);
			else{
				for (i = 1; i < points.length - 2; i++) {
					var c = (points[i][0] + points[i + 1][0]) / 2,
						d = (points[i][1] + points[i + 1][1]) / 2;
					ps.push(['Q',points[i], [c, d]]);
				}
				ps.push(['Q',points[i], points[i + 1]]);
			}
			return ps;
		},
		distance = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
		},

		start = function(e){
			curr = new Path(Draw.options);

			if(curr.stroke()=='none')
				curr.stroke('black');
			curr.fill('none');

			var s = Draw.fromView(e.start);
			Draw.add(curr);
			points = [[s.x, s.y]];
			point = s;
			curr.moveTo(s);
			following = true;
			requestAnimationFrame(follow);
		},

		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			var d = 3/10;
			point = {
				x: point.x*(1-d) + cursor.x*d,
				y: point.y*(1-d) + cursor.y*d
			};
			if(curr) curr.lineTo(point);
			points.push([point.x,point.y]);
			if(following) requestAnimationFrame(follow);
		},

		release = function(){
			following = false;
			if(curr){
				curr.path(smoothen(polySimplify(points,0.05/Draw.zoom())));
				//console.log(points.length, polySimplify(points,0.05/Draw.zoom()).length);
				Draw.commit(new Record(curr));
			}
			curr = null;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',

		dragstart:start,
		drag:drag,
		release:release,
		off:release
	};
});
