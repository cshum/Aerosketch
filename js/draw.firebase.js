define([
   'underscore','draw','firebase','layer','shape/factory',
   'util/requestanimationframe'
],function(_,Draw,Firebase,Layer,ShapeFactory,aniFrame){
	Draw.firebase = function(url,callback){
		var map = {},
			drawRef = new Firebase(url),
			layersRef = drawRef.child('layers'),
			bufferCall = (function(n){
				var buffer = [], 
					triggered = false,
					call = function(){
						for(var i=0;i<n;i++)
							if(buffer.length==0){
								triggered = false;
								return;
							}else buffer.shift()();

						_.defer(call);

					};
				return function(func){
					buffer.push(func);
					if(!triggered){
						_.defer(call);
						triggered = true;
					}
				}
			})(15);

		drawRef.once('value',callback); //onready

		layersRef.on('child_added',function(layerSnap){
			var id = layerSnap.name(),
				layer = map[id] || new Layer(),
				layerRef = layersRef.child(id),
				shapesRef = layerRef.child('shapes');

			shapesRef.on('child_added',function(shapeSnap){
				bufferCall(function(){
					var id = shapeSnap.name(),
						val = shapeSnap.val(),
						shapeRef = shapesRef.child(id),
						shape = map[id] || ShapeFactory(val.type,val);
					map[id] = shape;
					shapeRef.on('value',function(shapeSnap){
						shape.set(shapeSnap.val());
					});
					shape.delta.subscribe(_(shapeRef.update).bind(shapeRef));
					shape._destroy.subscribe(function(destroy){
						if(destroy) shapeRef.remove();
					});
					layer.shapes.push(shape);
				});
			});

			shapesRef.on('child_removed',function(shapeSnap){
				var shape = map[shapeSnap.name()];
				shape.visible(false);
				shape._destroy(true);
			});

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

		layersRef.child('default').transaction(function(data){
			if(data===null){
				return {
					visible:true,
					name:'Default Layer'
				}
			}
		});
	};
	return {
		load: function(params, require, callback){
			Draw.firebase(params,callback);
		}
	}
});
