define([
	'underscore',
	'shape/path','draw','record/shape',
	'util/catmullrom','util/polysimplify'
],function(_,Path,Draw,Record,catmullRom,polySimplify){
	var points, curr, interval,
		drawPoints = function(shape,points) {
			if (points.length < 6) return;
		   	shape.clear();
			shape.moveTo(points[0][0], points[0][1]);
			for (i = 1; i < points.length - 2; i++) {
				var c = (points[i][0] + points[i + 1][0]) / 2,
					d = (points[i][1] + points[i + 1][1]) / 2;
				shape.qCurveTo(points[i][0], points[i][1], c, d);
			}
			shape.qCurveTo(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
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
			curr.moveTo(s);
			interval = setInterval()
		},

		drag = function(e){
			var pos = Draw.fromView(e.position);
			curr.lineTo(pos);
			points.push([pos.x,pos.y]);
		},

		tap = function(e){
			start(e);
			var pos = Draw.fromView(e.position);
			points.push([pos.x,pos.y]);
		},

		release = function(){
			if(curr){
				drawPoints(curr,polySimplify(points,1/Draw.zoom()));
				//curr.path(catmullRom(polySimplify(points,1/Draw.zoom())));
				Draw.commit(new Record(curr));
			}
			curr = null;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',

		dragstart:start,
		drag:drag,
		tap:tap,
		release:release,
		off:release
	};
});
