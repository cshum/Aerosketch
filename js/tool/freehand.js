define([
	'underscore',
	'shape/path','draw','record/shape',
	'util/requestanimationframe','util/polysimplify'
],function(_,Path,Draw,Record,requestAnimationFrame,polySimplify){
	var points, interval, point, cursor, following, options,
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
		start = function(e){
			var s = Draw.fromView(e.start), 
				ctx = Draw.bufferContext;
			points = [[s.x, s.y]];
			point = s;

			if (Draw.options.stroke()=='none')
				Draw.options.stroke('black');

			following = true;
			requestAnimationFrame(follow);
			if(Draw.bufferContext){
				ctx.lineWidth = Draw.options.strokeWidth() * Draw.zoom();
				ctx.lineCap='round';
				ctx.strokeSytle = Draw.options.stroke();
			}
		},
		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		follow = function(){
			var d = 3/10, p, ctx = Draw.bufferContext;
			if(ctx){
				p = Draw.toView(point);
				ctx.beginPath();
				ctx.moveTo(p.x,p.y);
			}
			point = {
				x: Draw.round(point.x*(1-d) + cursor.x*d),
				y: Draw.round(point.y*(1-d) + cursor.y*d)
			};
			if(ctx){
				p = Draw.toView(point);
				ctx.lineTo(p.x,p.y);
				ctx.stroke();
			}
			points.push([point.x,point.y]);
			if(following) requestAnimationFrame(follow);
		},
		tap = function(e){
			var s = Draw.fromView(e.start);
			points = [[s.x, s.y],[s.x, s.y]];
		},
		release = function(){
			following = false;
			var curr = new Path(Draw.options);
			curr.fill('none');
			curr.path(smoothen(polySimplify(points,0.1/Draw.zoom())));
			Draw.add(curr);
			Draw.commit(new Record(curr));
			curr = null;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',

		dragstart:start,
		drag:drag,
		release:release,
		tap:tap,
		off:release
	};
});
