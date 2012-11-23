define(['underscore','transform','draw'],
function(_,Transform,Draw){
	var angle, trans,

		check = function(target){
			var selected = _(Draw.selection()).contains(target);
			if(!selected) Draw.deselect();
			return selected;
		},

		start = function(e){
			Transform.on(Draw.selection());
			trans = true;
			angle = null;
		},

		drag = function(e){
			if(!angle) 
				angle = e.angle;
			if(e.shiftKey || e.button==2)
				Transform.set({
					origin:e.start,
					rotate:e.angle - angle
				});
			else
				Transform.set({translate:{
					x:e.distanceX,
					y:e.distanceY
				}});
		},

		transform = function(e){
			Transform.set({
				origin:e.position,
				rotate:e.rotation,
				scale:e.scale,
				translate:{
					x:e.distanceX,
					y:e.distanceY
				}
			});
		},

		finish = function(e){
			if(trans){
			}
			trans = false;
		},
		wheel = function(e){
			Transform.on(Draw.selection());
			Transform.set({origin:e.position, scale:1+e.delta});
		};

	return {
		check:check,
		dragstart:start,
		transformstart:start,
		drag:drag,
		transform:transform,
		release:finish,
		wheel:wheel
	}
});
