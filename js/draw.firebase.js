define([
   'underscore','draw','firebase','layer','shape/factory',
   'util/requestanimationframe','util/deferbuffer'
],function(_,Draw,Firebase,Layer,ShapeFactory,aniFrame,deferBuffer){
	Draw.firebase = function(url,callback){
		var layersMap = {},
			drawRef = new Firebase(url),
			layersRef = drawRef.child('layers'),
			defer = deferBuffer(),
			defer15 = deferBuffer(15);

		drawRef.once('value',callback); //onready

		layersRef.on('child_added',function(layerSnap){
			var id = layerSnap.name(),
				layer = layersMap[id] || new Layer(),
				layerRef = layersRef.child(id),
				shapesMap = {},
				shapesRef = layerRef.child('shapes');

			layersMap[id] = layer;

			shapesRef.on('child_added',function(shapeSnap){
				defer(function(){
					var id = shapeSnap.name(),
						val = shapeSnap.val(),
						shapeRef = shapesRef.child(id),
						shape = shapesMap[id] || ShapeFactory(val.type,val);
					shapesMap[id] = shape;
					shapeRef.on('value',function(shapeSnap){
						shape.set(shapeSnap.val());
					});
					shape.delta.subscribe(_(shapeRef.update).bind(shapeRef));
					shape._destroy.subscribe(function(destroy){
						if(destroy) shapeRef.remove();
					});
					defer15(_(layer.shapes.push).bind(layer.shapes,shape));
				});
			});

			shapesRef.on('child_removed',function(shapeSnap){
				var shape = shapesMap[shapeSnap.name()];
				shape.visible(false);
				shape._destroy(true);
				delete shapesMap[shapeSnap.name()];
			});

			layer.newShape = function(type){
				var shape = ShapeFactory(type),
					shapeRef = shapesRef.push({type:type});
				shapesMap[shapeRef.name()] = shape;
				return shape;
			};

			Draw.layers.push(layer);
			shapesMap[id] = layer;
			Draw.layer(layer); //todo: only call at first run
		});
		layersRef.on('child_removed',function(layerSnap){
			var layer = layersMap[layerSnap.name()];
			layer.visible(false);
			layer._destroy(true);
			delete layersMap[layerSnap.name()];
		});

		layersRef.child('default').transaction(function(data){
			if(data===null){
				return {
					visible:true,
					name:'Default Layer'
				};
			}
		});
	};
	return {
		load: function(params, require, callback){
			Draw.firebase(params,callback);
		}
	};
});
