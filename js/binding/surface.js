define([
'knockout','underscore','jquery','hammer'
],function(ko,_,$,Hammer){

function binding(el,value){
	var drawTrigger = value(),
		inCanvas, target, pos, start, touchFlag,
		dragging, transforming, 
		offset = _.throttle(function(){
			return $(el).offset();
		},500),
		trigger = function(e){
			var type=e.type;
			e = e.gesture;
			//clear transform/drag when drag/transform
			
			if((dragging && type=='transform')
			|| (transforming && type=='drag'))
				trigger('release');

			if(type.match(/drag/)) dragging = true;
			if(type.match(/transform/)) transforming = true;

			if(type=='release'){
				dragging = false;
				transforming = false;
				drawTrigger('release');
				return;
			}
			var org =e.srcEvent;
			//target = org.target || org.touches[0].target;
			target = e.target;

			pos = {
				x:e.center.pageX - offset().left,
				y:e.center.pageY - offset().top
			};
			if(type=='touch') start = pos;

			var len = e.touches.length;
			if(len>1 && dragging) return;
			if(len>2 && transforming) return;

			var dx = pos.x - start.x,
				dy = pos.y - start.y,
				evt = {
					target:target,
					metaKey:org.metaKey,
					shiftKey:org.shiftKey,
					button:org.button,

					start: start, position:pos,
					distanceX:dx, 
					distanceY:dy,
					distance: Math.sqrt(dx*dx + dy*dy)
				};

			if(type=='drag')
				evt.angle = e.angle;
			_(evt).extend({
				scale:e.scale,
				rotation:e.rotation
			});
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
