define(['underscore','draw'],function(_,Draw){
	return function(shapes,e){
		var sin,cos,rad;
		if('rotate' in e){
			rad = e.rotate * Math.PI/180;
			sin = Math.sin(rad);
			cos = Math.cos(rad);
		}
		_(shapes).each(function(shape){
			var b = _(shape.bbox()).clone(),
				r = shape.rotate();
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
			shape.bbox(b);
			shape.rotate(r);
			if(e.scale) 
				shape.strokeWidth(Math.round(
					shape.strokeWidth()*e.scale*100)/100);
		});
	};
});

