define(['knockout','underscore','shape/template'],function(ko,_,Shape){
	var approxBezier = (function(){
			var getPointAt = function(ps,t){
				if(ps.length==1){
					return ps[0];
				}else{
					var newPs = [];
					for(var i=0;i<ps.length-1;i++)
						newPs.push([
							ps[i][0]+(ps[i+1][0]-ps[i][0])*t,
							ps[i][1]+(ps[i+1][1]-ps[i][1])*t
						]);
					return getPointAt(newPs,t);
				}
			};
			return function(ps,count){
				var curve = [];
				for(var i=0;i<=count;i++)
					curve.push(getPointAt(ps,i/count));
				return curve;
			};
		})(),
		minMax = function(prev,point){
			var x = point[0], 
				y = point[1];
			if(!prev)
				return { x1:x, x2:x, y1:y, y2:y, point:point };
			else
				return {
					x1: Math.min(x,prev.x1),
					x2: Math.max(x,prev.x2),
					y1: Math.min(y,prev.y1),
					y2: Math.max(y,prev.y2),
					point: point
				};
		},

		bbox = {
			read: function(){
				//check if path reseted
				if(this.currPath != this.path()){
					this.bounds = [];
					this.currPath = this.path();
				}
				//follow up bounds
				var path = this.path(), 
					bounds = this.bounds,
					bLen = bounds.length,
					pLen = path.length;
				for(var i=bLen; i<pLen; i++){
					var bound = i > 0 ? bounds[i-1]: null;
					switch(path[i][0]){
						case 'M': case 'L':
						bound = minMax(bound,path[i][1]);
						break;
						case 'C': case 'Q':
						_(approxBezier( 
							[bound.point].concat(_(path[i]).tail()), 20)).
							each(function(p){ bound = minMax(bound,p); });
						break;
						default:break;
					}
					bounds.push(bound);
				}
				//calculate bbox
				if(bounds.length > 0){
					var b = _(bounds).last();
					return {
						x: b.x1, 
						y: b.y1,
						width: b.x2 - b.x1,
						height: b.y2 - b.y1
					};
				}else
					return {x:0,y:0,width:0,height:0};
			},
			write: function(e){
				if(this.path().length > 0){
					var b = this.bbox();
					_(e).defaults(b);
					var rx = b.width !== 0 ? e.width/b.width:1,
						ry = b.height !== 0 ? e.height/b.height:1,
						dx = e.x - b.x,
						dy = e.y - b.y;
					_(this.path()).each(function(curr){
						_(curr).each(function(p,i){
							if(_.isArray(p)){
								p[0] = b.x + dx + (p[0] - b.x)*rx;
								p[1] = b.y + dy + (p[1] - b.y)*ry;
							}
						});
					});
					this.bounds = [];
					this.path.valueHasMutated();
				}
			}
		},

		d = function(){
			if(this.path().length>0)
				return _(this.path()).flatten().join(' ');
		},
		add = function(){
			this.path.push(
				_(arguments).map(function(val){
					return _.isObject(val) ? [val.x, val.y] : val; 
				}));
		},
		back = function(){
			if(this.path().length > 0){
				this.bounds.pop();
				return this.path.pop();
			}
		},
		clear = function(){
			this.path([]);
		},
		getPointAt = function(i){
			var p = this.bounds[i].point;
			return {x: p[0], y: p[1]};
		},
		getLastPoint = function(){
			if(this.path().length > 0 && _(this.path()).last()[0]!='Z')
				return getPointAt.call(this,this.bounds.length-1);
		};

	return Shape('path',function(){
		this.path = ko.observableArray([]);
		this.d = ko.computed(d,this);
		this.bounds = [];

		this.bbox = ko.computed(bbox,this);

		this.moveTo = _(add).bind(this,'M');
		this.lineTo = _(add).bind(this,'L');
		this.curveTo = _(add).bind(this,'C');
		this.qCurveTo = _(add).bind(this,'Q');
		this.close = _(add).bind(this,'Z');
		this.back = _(back).bind(this);
		this.clear = _(clear).bind(this);

		this.getPointAt = _(getPointAt).bind(this);
		this.getLastPoint = _(getLastPoint).bind(this);
		this.getFirstPoint = _(getPointAt).bind(this,0);
	},{ 
		attr:['d'],
		options:['path']
	});
});
