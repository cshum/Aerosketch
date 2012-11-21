define(['shape/path','draw'],function(Path,Draw){
	var points, curr, touched, dragged,
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
					[
						(-p[0].x + 6*p[1].x + p[2].x) / 6, 
						(-p[0].y + 6*p[1].y + p[2].y) / 6
					],
					[
						(p[1].x + 6*p[2].x - p[3].x) / 6,  
						(p[1].y + 6*p[2].y - p[3].y) / 6 
					],
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

		touch = function(e){
			if(e.no>1) return;

			touched = true;

			if(curr) release();
			curr = new Path(Draw.options);
			if(curr.stroke()=='none')
				curr.stroke('black');
			curr.fill('none');

			Draw.add(curr);
			points = [e.position];
			curr.moveTo(e.position);
		},

		move = function(e){
			if(touched){
				var pos = e.position;
				if(distance(_.last(points),pos) > 5/Draw.zoom()){
					dragged = true;
					points.push(pos);
					curr.lineTo(e.position);
				}
			}
		},
		release = function(){
			if(dragged){
				curr.path(catmullRom(points));
			}
			curr = null;
			touched = false;
			dragged = false;
		},
		select = function(e){
			if(e.target._shape)
				Draw.selection([e.target]);
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',

		touch:touch,
		move:move,
		release:release,
		close:release,

		tap:select
	};
});
