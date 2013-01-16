define(['underscore','draw'],function(_,Draw){
	function Transform(s){
		this.shapes = s;
		this.result = null;
		this.properties = _(this.shapes).map(function(shape){
			var rad = shape.rotate() * Math.PI/180;
			return {
				box: shape.bbox(),
				rotate:shape.rotate(),
				shape:shape
			};
		});
	}
	_(Transform.prototype).extend({
		set: function(e){
			var sin,cos,rad;
			if('rotate' in e){
				rad = e.rotate * Math.PI/180;
				sin = Math.sin(rad);
				cos = Math.cos(rad);
			}
			this.result = _(this.properties).map(function(p){
				var b = _(p.box).clone(),
					r = p.rotate;
				if('translate' in e){
					b.x += e.translate.x;
					b.y += e.translate.y;
				}
				if('scale' in e){
					b.width *= Math.abs(e.scale);
					b.height *= Math.abs(e.scale);

					//-ve wdith/height shift
					if(e.scale < 0){
						b.x -= b.width;
						b.y -= b.height;
					}

					b.x = e.origin.x + (b.x - e.origin.x)*e.scale;
					b.y = e.origin.y + (b.y - e.origin.y)*e.scale;

				}
				if('rotate' in e){
					b.x -= e.origin.x - b.width/2;
					b.y -= e.origin.y - b.height/2;

					var x = b.x, y = b.y;

					b.x = x*cos - y*sin;
					b.y = x*sin + y*cos;

					b.x += e.origin.x - b.width/2;
					b.y += e.origin.y - b.height/2;

					r += e.rotate;
				}
				r = Math.round(r*10)/10;
				b.x = Draw.round(b.x);
				b.y = Draw.round(b.y);
				b.width = Draw.round(b.width);
				b.height = Draw.round(b.height);

				p.shape.rotate(r % 360);
				p.shape.translateX(Draw.round(b.x - p.box.x));
				p.shape.translateY(Draw.round(b.y - p.box.y));
				if(e.scale){
					e.scale = Math.round(e.scale*100)/100;
					p.shape.scaleX(e.scale);
					p.shape.scaleY(e.scale);
				}
				return { box:b, scale:e.scale, rotate:r, shape:p.shape };
				//p.shape.bbox(b);
			});
		},
		done: function(){
			_(this.result).each(function(p){
				p.shape.translateX(0);
				p.shape.translateY(0);
				p.shape.scaleX(1);
				p.shape.scaleY(1);
				p.shape.bbox(p.box);
				p.shape.rotate(p.rotate % 360);
				if(p.scale) 
					p.shape.strokeWidth(
						Math.round(p.shape.strokeWidth()*p.scale*100)/100);
			});
		}
	});
	return Transform;
});

