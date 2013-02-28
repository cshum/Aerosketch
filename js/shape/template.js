define(['knockout','underscore'],function(ko,_){
	return function(type, func, config){
		var attrKeys = [
				'fill','stroke','strokeWidth','transform'
			].concat(config.attr),
			optionsKeys = [
				'fill','stroke','strokeWidth','rotate','visible'
			].concat(config.options),
			
			Shape = function(options){
				var self = this;

				func.call(self);

				self.fill = ko.observable();
				self.stroke = ko.observable();
				self.strokeWidth = ko.observable();
				self._destroy = ko.observable(false);

				var rotate = ko.observable(0);
				self.rotate = ko.computed({
					read:rotate, write: function(value){
						while(value < 0) value+=360;
						rotate(value % 360);
					}
				});
				self.transform = ko.computed(transform,self);
				self.visible = ko.observable(true);

				self._shape = true;
				self.type = type;

				//set up attr
				self.attr = {};
				_(attrKeys).each(function(key){
					self.attr[_(key).dasherize()] = self[key];
				});
				self.options = {};
				_(optionsKeys).each(function(key){
					self.options[key] = self[key];
				});

				self.record = options || {visible:false};
				self.delta = ko.observable({});
				self.redos = [];
				self.undos = [];

				self.set(options || {});
			},
			set = function(options){
				var self = this;
				_(ko.toJS(options || {})).
					each(function(val,key){
						if(key in self.options && !_.isEqual(self[key](),val)) 
							self[key](val);
					});
			},
			get = function(){
				var o = ko.toJS(this.options);
				o.type = type;
				return o;
			},
			isKO = function(val){
				return ko.isObservable(val) || ko.isComputed(val);
			},
			transform = function(){
				if(this.rotate() !== 0){
					var bbox = this.bbox();
					return 'rotate('+this.rotate()+' '+
						(bbox.x+bbox.width/2)+','+
						(bbox.y+bbox.height/2)+')';
				}
			},
			save = function(){
				var original = {}, 
					record = this.record,
					delta = {};
				_(this.options).each(function(value,key){
					var val = ko.toJS(value());
					if(!_.isEqual(record[key],val)){
						if(key in record)
							original[key] = record[key];
						delta[key] = val;
						record[key] = val;
					}
				});
				this.delta(delta);
				this.undos.push(original);
				this.redos = [];
			},
			undoredo = function(s1,s2){
				if(s1.length===0) return;
				var delta = s1.pop();
				s2.push(_(this.record).pick(_(delta).keys()));
				this.set(delta);
				this.delta(delta);
				_(this.record).extend(delta);
			},
			undo = function(){
				undoredo.call(this,this.undos,this.redos);
			},
			redo = function(){
				undoredo.call(this,this.redos,this.undos);
			};

		_(Shape.prototype).extend({
			set:set,
			get:get,
			save:save,
			undo:undo,
			redo:redo
		});
		return Shape;
	};
});
