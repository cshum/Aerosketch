define([
   'knockout','underscore','draw','layer','shape/factory',
   'util/requestanimationframe','util/deferbuffer','points',
	'http://static.firebase.com/v0/firebase.js',
	'https://cdn.firebase.com/v0/firebase-auth-client.js'
],function(ko,_,Draw,Layer,ShapeFactory,aniFrame,deferBuffer,points){
	var 
	aeroRef = new Firebase('https://aerosketch.firebaseio.com/'),
	surfacesRef = aeroRef.child('surfaces'),
	metaRef = aeroRef.child('surfacesMeta'),
	user = ko.observable(),
	id = ko.observable(),
	title = ko.observable(),
	auth = new FirebaseAuthClient(aeroRef,function(err,usr){
		if(err){
		}else if(usr){
		}else{
		}
		user(usr);
	}),
	create = function(){
		id(surfacesRef.push({
			'layers':{
				'default':{
					visible:true,
					name:'Default Layer',
					shapes:[{type:'path',visible:false}] //dummy
				}
			}
		}).name());
	},
	login = function(){
		auth.login('facebook', {
			rememberMe: true,
			scope: 'email,user_likes'
		});
	},
	logout = function(){
		auth.logout();
	};
	load = _.once(function(callback){
		var 
		titleRef = metaRef.child(id()).child('title'),
		surfaceRef = surfacesRef.child(id()),
		layersMap = {},
		layersRef = surfaceRef.child('layers'),
		defer = deferBuffer(),
		bound = {},
		isReady = false,
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

		titleRef.on('value',function(titleSnap){
			title(titleSnap.val());
		});
		title.subscribe(_(titleRef.set).bind(titleRef));

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
				shape.layer = layer;
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
	});
	_(Draw).extend({
		id:id,
		user:user,
		load:load,
		title:title,
		login:login,
		logout:logout,
		create:create
	});
});
