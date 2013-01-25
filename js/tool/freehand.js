define([
	'underscore','knockout',
	'shape/path','draw','record/shape',
	'util/requestanimationframe','util/polysimplify','text!view/freehand.svg'
],function(_,ko,Path,Draw,Record,requestAnimationFrame,polySimplify,view){
	var points = ko.observableArray([]), changed = false,
		interval, point, cursor, following,
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
		distance = function(p1,p2){
			var dx = p1.x - p2.x,
				dy = p1.y - p2.y;
			return Math.sqrt(dx*dx + dy*dy);
		},

		start = function(e){
			if(Draw.options.stroke()=='none')
				Draw.options.stroke('black');

			var s = Draw.fromView(e.start);
			points([[s.x, s.y]]);
			point = s;
			following = true;
			requestAnimationFrame(follow);
		},

		drag = function(e){
			cursor = Draw.fromView(e.position);
			changed = true;
		},
		follow = function(){
			var d = 0.5;
			point = {
				x: Draw.round(point.x*(1-d) + cursor.x*d),
				y: Draw.round(point.y*(1-d) + cursor.y*d)
			};
			points.push([point.x,point.y]);
			if(following) requestAnimationFrame(follow);
		},
		release = function(){
			if(!changed) return;
			points.push([cursor.x,cursor.y]);
			following = false;
			var curr = new Path(Draw.options);
			curr.fill('none');
			curr.path(smoothen(polySimplify(points(),0.1/Draw.zoom())));
			Draw.add(curr);
			Draw.log(new Record(curr));
			points.removeAll();
			changed = false;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',
		view:view,

		points: ko.computed(function(){ return _.flatten(points()).join(' '); }),
		dragstart:start,
		drag:drag,
		release:release
	};
});
