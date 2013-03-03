define([
	'underscore','knockout','draw',
	'util/requestanimationframe','util/polysimplify'
],function(_,ko,Draw,aniFrame,polySimplify){
	//var points = [], 
	var following = false,
		interval, point, prev, cursor, curr,
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
			following = true;
			aniFrame(follow);
			cursor = Draw.fromView(e.position);
			point = cursor;
			prev = null;
		},

		drag = function(e){
			cursor = Draw.fromView(e.position);
		},
		d = 0.5,
		follow = function(){
			if(dist(cursor,point) >= 5/Draw.zoom()){
				point = {
					x: Draw.round(point.x*(1-d) + cursor.x*d),
					y: Draw.round(point.y*(1-d) + cursor.y*d)
				};
				if(prev)
					curr.qCurveTo(prev,{
						x: (point.x + prev.x)/2,
						y: (point.y + prev.y)/2
					});
				else curr.lineTo(point);
				prev = point;
			}
			if(following) aniFrame(follow);
			else curr = null;
		},
		release = function(){
			//curr.path(smoothen(polySimplify(points,0.1/Draw.zoom())));
			Draw.save(curr);
			points = [];
			following = false;
		};

	return {
		name:'Freehand',
		iconView: '<span class="draw-icon-freehand"></span>',
		dragstart:start,
		drag:drag,
		release:release
	};
});
