define(function(){
	return function (shape){
		var r = shape.rotate(),
			rad = r * Math.PI/180,
			sin = Math.sin(rad),
			cos = Math.cos(rad),
			b = shape.bbox();

		if(!(b && b.width>0 && b.height>0)) return [];
		cx = b.x + b.width/2;
		cy = b.y + b.height/2;

		return _([
			{x:b.x, y:b.y}, {x:b.x+b.width, y:b.y},
			{x:b.x, y:b.y+b.height}, 
			{x:b.x+b.width, y:b.y+b.height}
		]).map(function(p){
			var x = p.x - cx,
				y = p.y - cy;
			return {
				x: x*cos - y*sin + cx,
				y: x*sin + y*cos + cy
			};
		});
	};
});
