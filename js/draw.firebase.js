define([
   'underscore','draw','firebase','layer','shape/factory'
],function(_,Draw,Firebase,Layer,ShapeFactory){
	var map = {};
	return {
		load: function(url, req, callback){
			var drawRef = new Firebase(url),
				layersRef = drawRef.child('layers'),
				layerFromSnapshot = function(layerSnap){
					//todo: layer from nowhere
					var id = layerSnap.name(),
						layerRef = layersRef.child(id)
						shapesRef = layerRef.child('shapes');
						shapeFromSnapshot = function(shapeSnap){
							var id = shapeSnap.name(),
								shapeRef = shapesRef.child(id);

						},
					shapesRef.on('child_added',shapeFromSnapshot);
					shapesRef.once('value',function(shapesSnap){
						shapesSnap.forEach(shapeFromSnapshot);
					});

					layer.newShape = function(type){
						var Shape = Factory(type),
							shape = new Shape(),
							shapeRef = shapesRef.push({type:type});
							map[shapeRef.name()] = shape;
							return shape;
					}
				};
			layersRef.on('child_added',layerFromSnapshot);
			layersRef.once('value',function(layersSnap){
				layersSnap.forEach(layerFromSnapshot);
			});
			callback();
		}
	}
});
