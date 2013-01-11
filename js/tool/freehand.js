define([
	'underscore',
	'shape/path','draw','record/shape',
	'util/catmullrom','util/polysimplify'
],function(_,Path,Draw,Record,catmullRom,polySimplify){
	var points, curr, 
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
				/*
				var ps = polySimplify(points,3);
				curr.path(_(polySimplify(points,3)).map(function (p,i) {
					return [(i==0 ? 'M':'L'),p];
				}));
				//*/
				curr.path(catmullRom(polySimplify(points,3)));
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
