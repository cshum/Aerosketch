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
		position = function(pos){
			if(!pos[0] || !pos[0].pageX) 
				return null;

			var sum = _(pos).chain()
				.map(function(p){
					return {x:p.pageX, y:p.pageY};
				})
				.reduce(function(a,b){
					return {x:a.x+b.x, y:a.y+b.y};
				},{x:0,y:0})
				.value(),
				len = pos.length;

			return {
				x: sum.x/len - offset().left,
				y: sum.y/len - offset().top
			};
		},
		trigger = function(e){
			var type=e.type;
			e = e.gesture;
			//clear transform/drag when drag/transform
			//
			/*
			if((dragging && type=='transform')
			|| (transforming && type=='drag'))
				trigger('release');

			if(type.match(/drag/)) dragging = true;
			if(type.match(/transform/)) transforming = true;
			*/

			if(type=='release'){
				//dragging = false;
				//transforming = false;
				drawTrigger('release');
				return;
			}
			var org = e.srcEvent;

		    //pos = position(org.touches || [org]);
			pos = {
				x:e.center.pageX - offset().left,
				y:e.center.pageY - offset().top
			};
			if(type=='touch' || type=='transformstart') start = pos;

			/*
			var len = e.touches.length;
			if(len>1 && dragging) return;
			if(len>2 && transforming) return;

			*/
			var dx = pos.x - start.x,
				dy = pos.y - start.y,
				evt = {
					distanceX:dx, 
					distanceY:dy,
					distance: Math.sqrt(dx*dx + dy*dy),

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
