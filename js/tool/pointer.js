define([
	'knockout','underscore','draw',
	'text!view/pointer.svg'
],function(ko,_,Draw,view){
	var p1 = ko.observable(),
		p2 = ko.observable(),

		start = function(e){
			p1(Draw.fromView(e.start));
		},
		drag = function(e){
			p2(Draw.fromView(e.position));
		},
		end = function(){
			p1(null);
			p2(null);
		},

		finish = function(){
			if(p1() && p2()){
				var x1 = Math.min(p1().x, p2().x),
					y1 = Math.min(p1().y, p2().y),
					x2 = Math.max(p1().x, p2().x),
					y2 = Math.max(p1().y, p2().y),
					test = function(p){
						return p.x >= x1 && p.x <= x2 && 
							p.y >= y1 && p.y <= y2;
					},
					selected = [];

				_(Draw.layers()).each(function(layer){
					if(layer.visible())
						_(layer.shapes()).each(function(shape){
							if( _( points(shape) ).all(test) &&
							shape.visible() )
								selected.push(shape);
						});
				});
				Draw.selection(selected);
			}
			end();
		};
	return {
		name:'Rectangle',
		iconView: '<span class="draw-icon-pointer"></span>',
		view:view,

		rect:ko.computed(function(){
			if(p1() && p2())
				return Draw.toView({
					x:Math.min(p1().x,p2().x),
					y:Math.min(p1().y,p2().y),
					width: Math.abs(p1().x - p2().x),
					height: Math.abs(p1().y - p2().y)
				});
		}),

		dragstart:start,
		drag:drag,
		release:finish,
		close:end
	};
});
