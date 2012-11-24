define(['knockout','underscore','transform','draw',
'text!view/selected.svg'],
function(ko,_,Transform,Draw,view){
	var angle, trans,

		selectedBBox = function(shape){
			if(Draw.debounce()) return {
				style:'display:none;'
			};
			var b = shape.bbox(),
				r = shape.rotate(),
				w = shape.stroke()!='none' ? 
					shape.strokeWidth()*Draw.zoom():0,
				o = Draw.toView(b,'_selected');
			o.transform = 'rotate('+r+' '
				+(o.x+o.width/2)+','+(o.y+o.height/2)+')';
			o.style = null;
			o.x -= w/2 + 1; o.y -= w/2 + 1;
			o.width += w + 2; o.height += w + 2;
			return o;
		},

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
					origin:Draw.fromView(e.start),
					rotate:e.angle - angle
				});
			else
				Transform.set({translate:{
					x:e.distanceX/Draw.zoom(),
					y:e.distanceY/Draw.zoom()
				}});
		},

		transform = function(e){
			Transform.set({
				origin:Draw.fromView(e.position),
				rotate:e.rotation,
				scale:e.scale,
				translate:{
					x:e.distanceX/Draw.zoom(),
					y:e.distanceY/Draw.zoom()
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
			Transform.set({
				origin:Draw.fromView(e.position),
				scale:1+e.delta
			});
		};

	return {
		check:check,
		dragstart:start,
		transformstart:start,
		drag:drag,
		transform:transform,
		release:finish,
		wheel:wheel,

		view:view,
		selectedBBox:selectedBBox
	}
});
