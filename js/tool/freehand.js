define([
   'shape/path','draw','record/shape',
   'util/catmullrom','util/polysimplify'
],function(Path,Draw,Record,catmullRom,polySimplify){
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

			var start = Draw.fromView(e.start);
			Draw.add(curr);
			points = [[start.x, start.y]];
			curr.moveTo(start);
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
				curr.path(catmullRom(polySimplify(points,5)));
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
