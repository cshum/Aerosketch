define([
   'underscore','draw','firebase','layer','shape/factory'
],function(_,Draw,Firebase,Layer,ShapeFactory){
	return {
		load: function(url, req, callback){
			var map = {},
				drawRef = new Firebase(url),
				layersRef = drawRef.child('layers'),

				layerFromSnapshot = function(layerSnap){
					_.defer(function(){
						var id = layerSnap.name(),
							layer = map[id] || new Layer(),
							layerRef = layersRef.child(id),
							shapesRef = layerRef.child('shapes'),
							shapeFromSnapshot = function(shapeSnap){
								_.defer(function(){
									var id = shapeSnap.name(),
										val = shapeSnap.val(),
										shapeRef = shapesRef.child(id),
										shape = map[id] || ShapeFactory(val.type,val);
									map[id] = shape;
									shapeRef.on('value',function(shapeSnap){
										shape.set(shapeSnap.val());
									});
									shape.delta.subscribe(_(shapeRef.update).bind(shapeRef));
									layer.shapes.push(shape);
								});
							};

						shapesRef.on('child_added',shapeFromSnapshot);

						layer.newShape = function(type){
							var shape = ShapeFactory(type),
								shapeRef = shapesRef.push({type:type});
							map[shapeRef.name()] = shape;
							return shape;
						};
						Draw.layers.push(layer);
						map[id] = layer;
						Draw.layer(layer);
					});
				};
			layersRef.on('child_added',layerFromSnapshot);

			layersRef.child('default').transaction(function(data){
				if(data===null){
					return {
						visible:true,
						name:'Default Layer'
					}
				}
			});
			callback();
		}
	};
});
