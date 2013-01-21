define([
	'shape/rect','shape/ellipse','shape/circle','shape/path'
],function(Rect, Ellipse, Circle, Path){
	return function(type){
		switch(type){
			case 'rect': return Rect; break;
			case 'ellipse': return Ellipse; break;
			case 'circle': return Circle; break;
			case 'path': return Path; break;
			default:break;
		}
		return null;
	};
});
