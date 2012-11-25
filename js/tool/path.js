define([
	'knockout','shape/path','draw',
	'text!view/path.svg',
],function(ko,Path,Draw,view){
	var curr, c1, c2, touching, focus,

		selectors = ko.computed(function(){
			if(Draw.tool() && Draw.tool()._path)
				return _(Draw.selection())
					.chain()
					.filter(function(shape){
						return shape.getType()=='path'
							&& shape.getLastPoint()
							&& shape.rotate()==0;
					})
					.map(function(shape){
						var p = Draw.toView(shape.getLastPoint());
						p._selector = true;
						p.shape = shape;
						return p;
					})
					.value();
		}),

		begin = ko.observable(),
		center = ko.observable(),
		control1 = ko.observable(),
		control2 = ko.observable(),
		check = function(vm){
			return vm._selector;
		},

		touch = function(e){
			focus = ko.dataFor(e.target);
			touching = true;
		},
		start = function(e){
			if(focus == begin()) 
				center(Draw.toView(curr.getFirstPoint()));
			else if(focus != center()) 
				center(e.start);

			if(!curr){
				c1 = null;
				if(focus._selector){
					curr = focus.shape;
					center(Draw.toView(curr.getLastPoint()));
				}else{
					curr = new Path(Draw.options);
					curr.moveTo(Draw.fromView(center()));
					Draw.add(curr);
				}
				begin(Draw.toView(curr.getFirstPoint()));
			}
		},
		drag = function(e){
			if(curr){
				if(c1){
					var p = Draw.fromView(e.position),
						c = Draw.fromView(center());
					c2 = { x: 2*c.x-p.x, y: 2*c.y-p.y };
					curr.back();
					curr.curveTo(c1,c2,c);
					control2(c2);
				}
				control1(e.position);
			}
		},
		tap = function(e){
			start(e);
			if(curr){
				if(c1){
					var c = Draw.fromView(center());
					curr.back();
					curr.curveTo(c1,c,c);
				}
				control1(e.position);
				control2(null);
			}
		},
		release = function(){
			touching = false;
			Draw.deselect();
			if(curr){
				if(focus == center()){
					//remove exceeded line
					curr.back();
					end();
				}else if(focus == begin()){
					curr.close();
					end();
				}else{
					curr.lineTo(Draw.fromView(center()));
					c1 = Draw.fromView(control1());
				}
			}
		},

		move = function(e){
			if(curr && !touching && c1){
				curr.back();
				var p = Draw.fromView(e.position);
				curr.curveTo(c1,p,p);
			}
		},

		end = function(){
			if(curr){
				Draw.selection([curr]);
			}
			curr = null;
			c1 = null;
			control1(null);
			control2(null);
			center(null);
			begin(null);
		};
		
	return {
		name:'Path Tool',
		iconView: '<span class="draw-icon-path"></span>',
		view:view,

		_path: true,

		check:check,
		center: center,
		begin: begin,
		control1: control1,
		control2: control2,
		selectors: selectors,

		touch:touch,
		dragstart:start,
		drag:drag,
		tap:tap,
		hold:tap,
		release:release,
		move:move,

		close:end
	};
});
