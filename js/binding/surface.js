define([
'knockout','underscore','jquery','hammer'
],function(ko,_,$,Hammer){

function binding(el,value){
	var drawTrigger = value(),
		inCanvas, target, pos, start,
		transforming,
		position = function(e){
			var pos = e.touches || [e];
			if(!pos[0] || !pos[0].clientX) 
				return null;

			var sum = _(pos).chain()
				.map(function(p){
					return {x:p.clientX, y:p.clientY};
				})
				.reduce(function(a,b){
					return {x:a.x+b.x, y:a.y+b.y};
				},{x:0,y:0})
				.value(),
				len = pos.length;

			return {
				x: sum.x/len - $(el).offset().left,
				y: sum.y/len - $(el).offset().top
			};
		},
		trigger = function(type,e){
			target = e.originalEvent.target ||
				e.originalEvent.touches[0].target;

			pos = position(e.originalEvent) || pos;
			if(type=='touch'){
				start = pos;
				inCanvas = $(el).find(target).length>0;
			}
			if(!inCanvas) return;

			if(type.match(/drag/) && (e.touches || [e]).length > 2)
				return;

			if(type=='transformstart')
				transforming = true;
			if(type=='release')
				transforming = false;
			if(transforming && type.match(/drag/))
				return;
			
			var dx = pos.x - start.x,
				dy = pos.y - start.y,
				evt = {
					target:target,
					metaKey:e.originalEvent.metaKey,
					shiftKey:e.originalEvent.shiftKey,
					button:e.originalEvent.button,

					start: start, position:pos,
					distanceX:dx, 
					distanceY:dy,
					distance: Math.sqrt(dx*dx + dy*dy)
				};

			if(type=='drag')
				evt.angle = e.angle;
			if(type=='transform')
				_(evt).extend({
					scale:e.scale,
					rotation:e.rotation
				});
			if(type=='wheel')
				evt.delta = (
					e.originalEvent.wheelDelta/3500 ||
					-e.originalEvent.detail/50
				);
			drawTrigger(type,evt);
		};


	_(new Hammer(document.body,{
		drag_min_distance:10,
		prevent_default:true,
		scale_treshold:0,
		rotation_treshold:0
	})).extend({
		ontap:_(trigger).bind(null,'tap'),
		ondoubletap:_(trigger).bind(null,'doubletap'),
		ondragstart:_(trigger).bind(null,'dragstart'),
		ondrag:_(trigger).bind(null,'drag'),
		ontransformstart:_(trigger).bind(null,'transformstart'),
		ontransform:_(trigger).bind(null,'transform'),
		onrelease:_(trigger).bind(null,'release')
	});

	$(document.body)
		.on('touchstart mousedown',_(trigger).bind(null,'touch'))
		.on('touchmove mousemove',_(trigger).bind(null,'move'));
	$(el)
		.on('mousewheel DOMMouseScroll',
			_(trigger).chain().bind(null,'wheel').throttle(20).value());
};
ko.bindingHandlers.surface = {
	init:binding
};

});
