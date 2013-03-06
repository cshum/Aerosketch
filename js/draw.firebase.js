define([
   'underscore','draw','firebase','layer','shape/factory',
   'util/requestanimationframe','util/deferbuffer','util/points'
],function(_,Draw,Firebase,Layer,ShapeFactory,aniFrame,deferBuffer,points){
	Draw.firebase = _.once(function(url,callback){
		var layersMap = {},
			drawRef = new Firebase(url),
			layersRef = drawRef.child('layers'),
			defer = deferBuffer(),
			pushDefer = deferBuffer(10),
			bound = {},
			isReady = false;
			ready = _.once(function(){
				if('x1' in bound)
					callback({
						x:bound.x1,
						y:bound.y1,
						width:bound.x2 - bound.x1,
						height:bound.y2 - bound.y1
					});
				else callback();
			});

		drawRef.once('value',function(){
			defer(function(){
				pushDefer(ready);
			});
		});

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
					if(!isReady && shape.visible())
						_(points(shape)).each(function(p){
							bound.x1 = Math.min(p.x, bound.x1 || p.x);
							bound.y1 = Math.min(p.y, bound.y1 || p.y);
							bound.x2 = Math.max(p.x, bound.x2 || p.x);
							bound.y2 = Math.max(p.y, bound.y2 || p.y);
						});
					pushDefer(function(){
						ready();
						layer.shapes.push(shape);
					});
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
	});
	return {
		load: function(params, require, callback){
			Draw.firebase(params,callback);
		}
	};
});
