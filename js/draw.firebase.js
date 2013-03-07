define([
   'underscore','draw','layer','shape/factory',
   'util/requestanimationframe','util/deferbuffer','points',
	'http://static.firebase.com/v0/firebase'
],function(_,Draw,Layer,ShapeFactory,aniFrame,deferBuffer,points){
	Draw.firebase = _.once(function(url,callback){
		var layersMap = {},
			drawRef = new Firebase(url),
			layersRef = drawRef.child('layers'),
			defer = deferBuffer(),
			bound = {},
			isReady = false;
			ready = _.once(function(){
				isReady = true;
				if('x1' in bound)
					callback({
						x:bound.x1,
						y:bound.y1,
						width:bound.x2 - bound.x1,
						height:bound.y2 - bound.y1
					});
				else callback();
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
					if(!isReady && shape.visible()){
						var w = (shape.stroke()!='none' ? 
							shape.strokeWidth():0);
						_(points(shape)).each(function(p){
							bound.x1 = Math.min(p.x - w/2, bound.x1 || p.x - w/2);
							bound.y1 = Math.min(p.y - w/2, bound.y1 || p.y - w/2);
							bound.x2 = Math.max(p.x + w, bound.x2 || p.x + w);
							bound.y2 = Math.max(p.y + w, bound.y2 || p.y + w);
						});
					}
					layer.shapes.push(shape);
					if(!isReady) aniFrame(ready);
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

		/*
				{
					layers:{
						default:{
							visible:true,
							name:'Default Layer',
							shapes:[{type:'rect',visible:false}] //dummy
						}
					}
				}
		*/
	});
});
