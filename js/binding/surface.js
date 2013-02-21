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
			var type=e.type;
			e = e.gesture;

			if(type=='release'){
				drawTrigger('release');
				return;
			}
			var org = e.srcEvent;

			pos = {
				x:e.center.pageX - offset().left,
				y:e.center.pageY - offset().top
			};
			if(type=='touch') start = pos;

			var evt = {
					distanceX:e.deltaX, 
					distanceY:e.deltaY,
					distance: e.distance,

					target:e.target,
					metaKey:org.metaKey,
					shiftKey:org.shiftKey,
					button:org.button,

					start: start, position:pos,
					scale:e.scale,
					rotation:e.rotation,
					angle:e.angle
				};
			/*
			if(type=='wheel')
				evt.delta = Math.max(-0.2,Math.min(0.2,
					org.wheelDelta/3500 ||
					-org.detail/50
				));
				*/
			drawTrigger(type,evt);
		};


	Hammer(el,{
		drag_min_distance:10,
		prevent_default:true,
		doubletap_interval:0,
		transform_min_scale: 0,
		hold:false
	}).on('touch tap dragstart drag transformstart transform release',trigger);

	/*
	$(document.body)
		.on('mousedown',_(trigger).bind(null,'touch',false))
		.on('mousemove',_(trigger).bind(null,'move',false))
		.on('touchstart',_(trigger).bind(null,'touch',true))
		.on('touchmove',_(trigger).bind(null,'move',true));
	$(el)
		.on('mousewheel DOMMouseScroll',
			_(trigger).chain().bind(null,'wheel',false).throttle(20).value());
		*/
};
ko.bindingHandlers.surface = {
	init:binding
};

});
