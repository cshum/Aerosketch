define(['knockout','underscore','layer'],function(ko,_,Layer){
	var layers = ko.observableArray([new Layer()]),
		layer = ko.observable(),

		toView = function(b,label){
			b = ko.utils.unwrapObservable(b); 
			if(!b) return;
			var p = position(), z = zoom(), o = {};
			if('x' in b) o.x = (b.x*z - p.x); 
			if('y' in b) o.y = (b.y*z - p.y);
			if('width' in b) o.width = Math.round(b.width*z);
			if('height' in b) o.height = Math.round(b.height*z);
			if(label) o[label] = true;
			return o;
		},
		fromView = function(b,label){
			b = ko.utils.unwrapObservable(b);
			if(!b) return;
			var p = position(), z = zoom(), o = {};
			if('x' in b) o.x = (p.x + b.x)/z; 
			if('y' in b) o.y = (p.y + b.y)/z;
			if('width' in b) o.width = b.width/z;
			if('height' in b) o.height = b.height/z;
			if(label) o[label] = true;
			return o;
		},

		add = function(){
			layer().shapes.push.apply(
				layer().shapes,arguments);
		},

		position = ko.observable({x:0,y:0}),
		origin = ko.observable({x:0,y:0}),

		zoom = (function(){
			var zoom = ko.observable(1);
			return ko.computed({
				read: zoom,
				write: function(val){
					val = Math.max(val,0.01);
					var scale = val - zoom(),
						p = position(),
						o = origin();
					position({
						x: p.x + scale*o.x,
						y: p.y + scale*o.y
					});
					zoom(val);
				}
			});
		})(),

		background = ko.observable('white'),

		transform = ko.computed(function(){
			var p = position(),
				z = Math.round(zoom()*1000)/1000;
			return 'translate('+(-p.x)+' '+(-p.y)+') scale('+z+')';
		}).extend({throttle: 1});

	layer(layers()[0]);

	return {
		layers: layers,
		layer: layer,

		fromView:fromView,
		toView:toView,

		zoom:zoom, 
		origin:origin, 
		position:position,
		transform:transform,

		background:background,
		add:add
	}
});
