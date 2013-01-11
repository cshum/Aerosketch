define([
	'underscore',
	'shape/path','draw','record/shape',
	'util/catmullrom','util/polysimplify'
],function(_,Path,Draw,Record,catmullRom,polySimplify){
	var points, curr, interval,
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
			curr.moveTo(s);
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
				curr.path(smoothen(polySimplify(points,0.3/Draw.zoom())));
				console.log(points.length,polySimplify(points,0.3/Draw.zoom()).length );
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
