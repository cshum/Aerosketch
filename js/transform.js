define(['underscore'],function(_){
	var shapes, properties;

		on = function(s,o){
			shapes = s;

			properties = _(shapes).map(function(shape){
				var rad = shape.rotate() * Math.PI/180;
				return {
					box: shape.bbox(),
					rotate:shape.rotate(),
					shape:shape
				};
			});

		},

		transform = function(e){
			var sin,cos,rad;
			if('rotate' in e){
				rad = e.rotate * Math.PI/180;
				sin = Math.sin(rad);
				cos = Math.cos(rad);
			}
			_(properties).each(function(p){
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
				p.shape.bbox(b);
				p.shape.rotate(r % 360);
			});
		};

	return {
		on:on,
		set:transform
	};
});

