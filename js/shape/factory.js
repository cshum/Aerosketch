define([
	'shape/rect','shape/ellipse','shape/circle','shape/path'
],function(Rect, Ellipse, Circle, Path){
	return function(type,options){
		switch(type){
			case 'rect': return new Rect(options); break;
			case 'ellipse': return new Ellipse(options); break;
			case 'circle': return new Circle(options); break;
			case 'path': return new Path(options); break;
			default:break;
		}
		return null;
	};
});
