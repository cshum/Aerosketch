define(['knockout','underscore','transform','draw',
'util/kosvgtemplate', 'text!view/selected.svg',
'util/requestanimationframe'],
function(ko,_,Transform,Draw,svgTemplate, view, aniFrame){
	var selectedTemplate = svgTemplate(Draw.selection,function(shape){
			return shape.view || '<'+shape.type+' data-bind="aniattr:attr" />';
		}),
		selectedBBox = function(shape){
			var b = shape.bbox(),
				r = shape.rotate(),
				w = shape.stroke()!='none' ? 
					shape.strokeWidth()*Draw.zoom():0,
				o = Draw.toView(b);
			o.transform = 'rotate('+r+' '+(o.x+o.width/2)+','+(o.y+o.height/2)+')';
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

		angle, scale, changed = false,
		buffer = ko.observable({}),
		visibles, shapes,

		start = function(){
			scale = 1;
			angle = null;
			if(changed) return;
			changed = true;
			Draw.transforming(true);
			shapes = _(Draw.selection()).clone();
			visibles = _(shapes).map(function(shape){
				return shape.visible();
			});
			_(shapes).invoke('visible',false);
		},

		drag = function(e){
			if(!angle) 
				angle = e.angle;
			if(e.shiftKey || e.button==2)
				buffer({
					rotate:e.angle - angle,
					origin:Draw.fromView(e.start)
				});
			else
				buffer({translate:{
					x:e.distanceX/Draw.zoom(),
					y:e.distanceY/Draw.zoom()
				}});
		},

		transform = function(e){
			buffer({
				origin:Draw.fromView(e.position),
				rotate:e.rotation,
				scale:e.scale,
				translate:{
					x:e.distanceX/Draw.zoom(),
					y:e.distanceY/Draw.zoom()
				}
			});
		},

		startPos,
		wheel = function(e){
			if(!changed){
				startPos = Draw.fromView(e.position);
				start();
			}
			scale *= 1 +e.delta;
			buffer({
				origin:startPos,
				scale:scale
			});
		};

	Draw.debounce.subscribe(function(debounce){
		if(!debounce && changed){
			Transform(shapes,buffer());
			aniFrame(function(){
				changed = false;
				Draw.transforming(false);
				_(shapes).each(function(shape,i){
					shape.visible(visibles[i]);
				});
				Draw.save.apply(null,shapes);
				buffer({});
			});
		}
	});

	return {
		check:check,
		dragstart:start,
		transformstart:start,
		transform:transform,
		drag:drag,
		buffer:ko.computed(function(){
			var str = '', e = buffer();
			if(e.origin) 
				str += 'translate('+e.origin.x+','+e.origin.y+') ';
			if(e.rotate) str += 'rotate('+e.rotate+')';
			if(e.scale) str += 'scale('+e.scale+')';
			if(e.origin) 
				str += 'translate('+(-e.origin.x)+','+(-e.origin.y)+') ';
			if(e.translate) 
				str += 'translate('+e.translate.x+','+e.translate.y+') ';
			return str;
		}),
		wheel:wheel,

		view:view,
		selectedBBox:selectedBBox,
		selectedTemplate:selectedTemplate,
	}
});
