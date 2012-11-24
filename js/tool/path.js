define([
	'knockout','shape/path','draw',
	'text!view/path.svg',
],function(ko,Path,Draw,view){
	var curr, c1, c2, touching, moved, focus,

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
		});

		begin = ko.observable(),
		center = ko.observable(),
		control1 = ko.observable(),
		control2 = ko.observable(),

		touch = function(e){
			focus = e.target;
			touching = true;
			moved = false;

			if(focus._begin) 
				center(curr.getFirstPoint());
			else if(!focus._center) 
				center(Draw.fromView(e.position));

			if(!curr){
				c1 = null;
				if(focus._selector){
					curr = focus.shape;
					center(curr.getLastPoint());
				}else{
					curr = new Path(Draw.options);
					curr.moveTo(center());
					Draw.add(curr);
				}
				begin(curr.getFirstPoint());
			}
		},
		release = function(e){
			touching = false;
			control1(null);
			control2(null);
			if(curr){
				//no drag
				if(!moved && c1){
					curr.back();
					curr.curveTo(c1,center(),center());
				}
				if(focus._center){
					//remove exceeded line
					curr.back();
					end();
				}else if(focus._begin){
					curr.close();
					end();
				}else{
					curr.lineTo(center());
					c1 = Draw.fromView(e.position);
				}
			}
		},

		drag = function(e){
			moved = true;
			if(curr){
				if(c1){
					var p = Draw.fromView(e.position),
						c = center();
					c2 = { x: 2*c.x-p.x, y: 2*c.y-p.y };
					curr.back();
					curr.curveTo(c1,c2,c);
					control2(c2);
				}
				control1(Draw.fromView(e.position));
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
			center(null);
			begin(null);
		};
		
	return {
		name:'Path Tool',
		iconView: '<span class="draw-icon-path"></span>',
		view:view,

		_path: true,

		center: ko.computed(_(Draw.toView).bind(null,center,'_center')),
		begin: ko.computed(_(Draw.toView).bind(null,begin,'_begin')),
		control1: ko.computed(_(Draw.toView).bind(null,control1)),
		control2: ko.computed(_(Draw.toView).bind(null,control2)),
		selectors: selectors,

		touch:touch,
		move:move,
		drag:drag,
		release:release,
		tap: function(){},

		close:end
	};
});
