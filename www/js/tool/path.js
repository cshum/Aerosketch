define([
	'knockout','draw',
	'text!view/path.svg'
],function(ko,Draw,view){
	var shape, c1, c2, touching, focus,

		selectors = ko.computed(function(){
			if(Draw.tool() && Draw.tool()._path)
				return _(Draw.selection())
					.chain()
					.filter(function(shape){
						return shape.type=='path'
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
		/*
		center: ko.computed(_(Draw.toView).bind(null,center,'_center')),
	   */
		center = ko.observable(),
		control1 = ko.observable(),
		control2 = ko.observable(),
		check = function(vm){
			focus = vm;
			touching = true;
			if(focus._center)
				shape.back(); //finish. remove exceeded line
			return vm._selector;
		},
		start = function(e){
			if(focus._begin && shape) 
				center(shape.getFirstPoint());
			else if(!focus._center) 
				center(Draw.fromView(e.start));

			if(!shape){
				c1 = null;
				if(focus._selector){
					shape = focus.shape;
					center(shape.getLastPoint());
				}else{
					shape = Draw.layer().newShape('path');
					shape.set(Draw.options);
					shape.moveTo(center());
				}
				begin(shape.getFirstPoint());
			}
		},
		drag = function(e){
			if(shape && !focus._center){
				var p = Draw.fromView(e.position),
					c = center();
				if(c1){
					c2 = { x: 2*c.x-p.x, y: 2*c.y-p.y };
					shape.back();
					shape.curveTo(c1,c2,c);
					control2(c2);
				}
				control1(p);
			}
		},
		tap = function(e){
			start(e);
			if(shape && !focus._center){
				if(c1){
					shape.back();
					shape.curveTo(c1,center(),center());
				}
				control1(Draw.fromView(e.position));
				control2(null);
			}
		},

		release = function(){
			touching = false;
			Draw.deselect();
			if(shape){
				if(focus._center){
					Draw.select(shape);
					finish(true);
				}else if(focus._begin){
					shape.close();
					Draw.select(shape);
					finish(true);
				}else{
					shape.lineTo(center());
					c1 = control1();
				}
			}
		},

		finish = function(ok){
			if(!ok && shape){
				Draw.deselect();
				shape.visible(false);
			}
			if(ok && shape) Draw.save(shape);
			shape = null;
			c1 = null;
			control1(null);
			control2(null);
			center(null);
			begin(null);
		},
		cpoints = ko.computed(function(){
			var ps = [], 
				c1 = Draw.toView(control1()),
				c2 = Draw.toView(control2()),
				c = Draw.toView(center());
			if(c1) ps.push(c1.x,c1.y);
			if(c) ps.push(c.x, c.y);
			if(c2) ps.push(c2.x,c2.y);
			return ps.join(' ');
		});
		
	return {
		name:'Path Tool',
		iconView: '<span class="draw-icon-path"></span>',
		view:view,

		_path: true,

		check:check,

		center: ko.computed(_(Draw.toView).bind(
			null,center,'_center')),
		begin: ko.computed(_(Draw.toView).bind(
			null,begin,'_begin')),
		control1: ko.computed(_(Draw.toView).bind(
			null,control1,'_control1')),
		control2: ko.computed(_(Draw.toView).bind(
			null,control2,'_control2')),
		cpoints:cpoints,

		selectors: selectors,

		dragstart:start,
		drag:drag,
		tap:tap,
		hold:tap,
		release:release,

		off: finish
	};
});
