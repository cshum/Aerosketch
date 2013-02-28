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

				self.record = ko.observable(options || {visible:false});
				self.redos = [];
				self.undos = [];

				update.call(self, options || {});
			},
			update = function(options){
				var self = this;
				_(ko.toJS(options || {})).
					each(function(val,key){
						if(key in self.options) 
							self[key](val);
					});
			},
			serialize = function(){
				var o = ko.toJS(this.options);
				o.type = type;
				return o;
			},
			clone = function(){
				return new Shape(this);
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
			commit = function(){
				var self = this, 
					original = {}, 
					record = self.record();
				_(self.options).each(function(value,key){
					var val = value();
					if(record[key] != val){
						if(key in record)
							original[key] = record[key];
					}
				});
				self.record(ko.toJS(self.options));
				self.undos.push(original);
				self.redos = [];
			},
			change = function(s1,s2){
				if(s1.length===0) return;
				var o = s1.pop(), 
					record = this.record();
				s2.push(_(record).pick(_(o).keys()));
				this.update(o);
				_(record).extend(o);
				this.record.valueHasMutated();
			},
			undo = function(){
				change.call(this,this.undos,this.redos);
			},
			redo = function(){
				change.call(this,this.redos,this.undos);
			};

		_(Shape.prototype).extend({
			update:update,
			serialize:serialize,
			clone:clone,
			commit:commit,
			undo:undo,
			redo:redo
		});
		return Shape;
	};
});
