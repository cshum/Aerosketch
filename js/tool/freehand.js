define(['shape/path','draw'],function(Path,Draw){
	var points, curr, 
		catmullRom = function( ps ) {
			var path = [ 
				['M',[ps[0].x, ps[0].y] ]
			];
			for (var i=0, l=ps.length; i<l-1; i++) {
				var p = [
					ps[Math.max(i-1,0)], 
					ps[i], ps[i+1], 
					ps[Math.min(i+2,l-1)] 
				];
				// Catmull-Rom 2 Cubic Bezier
				path.push(['C',
					[(-p[0].x + 6*p[1].x + p[2].x) / 6, 
					 (-p[0].y + 6*p[1].y + p[2].y) / 6 ],
					[(p[1].x + 6*p[2].x - p[3].x) / 6,  
					 (p[1].y + 6*p[2].y - p[3].y) / 6 ],
					[ p[2].x, p[2].y ]
				]);
			}
			return path;
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

			var start = Draw.fromView(e.start);
			Draw.add(curr);
			points = [start];
			curr.moveTo(start);
		},

		drag = function(e){
			var pos = Draw.fromView(e.position);
			if(distance(_.last(points),pos) > 5/Draw.zoom()){
				curr.lineTo(pos);
				points.push(pos);
			}
		},

		tap = function(e){
			start(e);
			points.push(Draw.fromView(e.position));
		},

		release = function(){
			if(curr){
				//curr.path(catmullRom(points)); disable for now
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
