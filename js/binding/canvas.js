define([
'knockout','underscore','jquery','hammer'
],function(ko,_,$,Hammer){

function canvasBinding(el,value,all,Draw){
	var inCanvas, target, pos, start,
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

			return Draw.fromView({
				x: sum.x/len - $(el).offset().left,
				y: sum.y/len - $(el).offset().top
			});
		},
		no = function(e){
			return (e.touches || [e]).length;
		},
		mouse = function(type,e){
			target = e.originalEvent.target ||
				e.originalEvent.touches[0].target;
			pos = position(e.originalEvent) || pos;
			if(type=='touch'){
				inCanvas = $(el).find(target).length>0;
				if(!inCanvas) return;
				start = pos;
			}
			var evt = {
				position: pos,
				start: start,
				target:ko.dataFor(target),
				metaKey:e.metaKey,
				shiftKey:e.shiftKey,
				button:e.button,
				no:no(e.originalEvent)
			};
			if(type=='wheel')
				evt.delta = (
					e.originalEvent.wheelDelta/3500 ||
					-e.originalEvent.detail/50
				);
			Draw.trigger(type,evt);
		},
		hammer = function(type,e){
			if(!inCanvas) return;

			pos = position(e.originalEvent) || pos;
			var evt = {
				target:ko.dataFor(target),
				metaKey:e.originalEvent.metaKey,
				shiftKey:e.originalEvent.shiftKey,
				button:e.originalEvent.button,
				no:no(e.originalEvent),
				start: start,
				position:pos
			};

			if(type.match(/drag/)){
				_(evt).extend({
					distance:e.distance/Draw.zoom(),
					distanceX:e.distanceX/Draw.zoom(),
					distanceY:e.distanceY/Draw.zoom()
				});
				if(type=='drag')
					evt.angle = e.angle;
			}
			if(type=='transform')
				_(evt).extend({
					scale:e.scale,
					rotation:e.rotation
				});
			Draw.trigger(type,evt);
		};


	_(new Hammer(document.body,{
		drag_min_distance:15,
		prevent_default:true
	})).extend({
		ontap:_(hammer).bind(null,'tap'),
		ondoubletap:_(hammer).bind(null,'doubletap'),
		ondragstart:_(hammer).bind(null,'dragstart'),
		ondrag:_(hammer).bind(null,'drag'),
		ontransformstart:_(hammer).bind(null,'transformstart'),
		ontransform:_(hammer).bind(null,'transform'),
		onrelease:_(hammer).bind(null,'release')
	});

	$(document.body)
		.on('touchstart mousedown',_(mouse).bind(null,'touch'))
		.on('touchmove mousemove',_(mouse).bind(null,'move'));
	$(el)
		.on('mousewheel DOMMouseScroll',
			_(mouse).chain().bind(null,'wheel').throttle(20).value());
};
ko.bindingHandlers.canvas = {
	init:canvasBinding
};

});
