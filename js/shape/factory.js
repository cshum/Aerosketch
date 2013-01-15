define(['knockout','underscore','hash'
],function(ko,_,Hash){
	return function(type, func, config){
		var attrKeys = [
				'fill','stroke','strokeWidth','strokeLinecap',
				'transform'
			].concat(config.attr),

			optionsKeys = [
				'fill','stroke','strokeWidth','strokeLinecap',
				'scale','translate','rotate','visible'
			].concat(config.options),
			
			setOptions = function(options){
				var self = this;
				_(ko.toJS(options || {})).
					each(function(val,key){
						if(key in self.options) 
							self[key](val);
					});
			},
			getOptions = function(){
				return ko.toJS(this.options);
			},
			clone = function(){
				return new Shape(this);
			},
			isKO = function(val){
				return ko.isObservable(val) || ko.isComputed(val);
			},
			transform = function(){
				var str = '', b = this.bbox();

				if(this.scale()){
					var x = b.x, y = b.y;
					if(this.translate()){
						x += this.translate().x;
						y += this.translate().y;
					}
					str += 'translate('+ x +'  '+ y +') '+
					'scale('+this.scale().x+' '+this.scale().y+') '+
					'translate('+ (-x) +'  '+ (-y) +')';
				}

				if(this.translate())
					str += 'translate('+this.translate().x+
					'  '+this.translate().y+') ';


				if(this.rotate() !== 0)
					str +='rotate('+this.rotate()+' '+
					(b.x+b.width/2)+','+
					(b.y+b.height/2)+')';

				return str!=='' ? str:null;
			},
			Shape = function(options, hash){
				var self = this;

				func.call(self);

				self.fill = ko.observable();
				self.stroke = ko.observable();
				self.strokeWidth = ko.observable();
				self.strokeLinecap = ko.observable();
				self.translate = ko.observable(null);
				self.scale = ko.observable(null);

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

				self.getType = function(){
					return type;
				};

				//Hash stuffs
				if(!hash) hash = Hash.generate();
				self.getHash = function(){
					return hash;
				};

				//set up attr
				self.attr = {};
				_(attrKeys).each(function(key){
					self.attr[_(key).dasherize()] = self[key];
				});
				self.options = {};
				_(optionsKeys).each(function(key){
					self.options[key] = self[key];
				});

				setOptions.call(self, options || {});
			};
		_(Shape.prototype).extend({
			setOptions:setOptions,
			getOptions:getOptions,
			clone:clone
		});
		return Shape;
	};
});
