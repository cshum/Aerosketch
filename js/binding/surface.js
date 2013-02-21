define([
'knockout','underscore','jquery','hammer'
],function(ko,_,$,Hammer){

function binding(el,value){
	var drawTrigger = value(),
		inCanvas, target, pos, start, 
		dragging, transforming, 
		offset = _.throttle(function(){
			return $(el).offset();
		},500),
		trigger = function(e){
			var type = e.type, g = e.gesture;

			if(type=='release'){
				drawTrigger('release');
				return;
			}
			pos = {
				x:g.center.pageX - offset().left,
				y:g.center.pageY - offset().top
			};
			if(type=='touch' || type=='transformstart') start = pos;

			var dx = pos.x - start.x,
				dy = pos.y - start.y,
				org = g.srcEvent;

			drawTrigger(type,{
				distanceX:dx, 
				distanceY:dy,
				distance: Math.sqrt(dx*dx + dy*dy),

				target:g.target,
				shiftKey:org.shiftKey,

				start: start, 
				position:pos,
				scale:g.scale,
				rotation:g.rotation,
				angle:g.angle
			});
		},
		wheelTrigger = function(e, delta){
			var org = e.originalEvent;
			drawTrigger('wheel',{
				delta: Math.max(-0.2,Math.min(0.2,
					org.wheelDelta/3500 ||
					-org.detail/50
				)),
				position: {
					x:org.pageX - offset().left,
					y:org.pageY - offset().top
				},
				shiftKey:org.shiftKey,
				target: e.target
			});
		};


	Hammer(el,{
		drag_min_distance:10,
		prevent_default:true,
		doubletap_interval:0,
		transform_min_scale: 0,
		hold:false
	}).on('touch tap dragstart drag transformstart transform release',trigger);

	$(el).on('mousewheel DOMMouseScroll',_.throttle(wheelTrigger,20));
};
ko.bindingHandlers.surface = {
	init:binding
};

});
