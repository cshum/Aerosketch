define(['knockout','underscore'],function(ko,_){
	function isKO (val){
		return ko.isObservable(val) || ko.isComputed(val);
	};
	function transform(){
		if(this.rotate() != 0){
			var bbox = this.bbox();
			return 'rotate('+this.rotate()+' '+
				(bbox.x+bbox.width/2)+','+(bbox.y+bbox.height/2)+')';
		}
	}

	function Factory(type, func, opt){
		var attrKeys = _(opt.attr || opt.options).clone();
		var optionKeys = _(opt.options || opt.attr).clone();

		if(!opt.noFill){
			attrKeys.push('fill');
			optionKeys.push('fill');
		}
		if(!opt.noStroke){
			attrKeys.push('stroke','strokeWidth','strokeLinecap');
			optionKeys.push('stroke','strokeWidth','strokeLinecap');
		}

		attrKeys.push('transform');
		optionKeys.push('scaleX','scaleY','rotate','visible');

		function setOptions(options){
			var self = this;
			options = ko.toJS(options || {});
			_(optionKeys).each(function(key){
				if(key in options) self[key](options[key]);
			});
		}

		function getOptions(){
			return ko.toJS(_(this).pick(optionKeys));
		}

		function clone(){
			return new Shape(this);
		}

		function Shape(options){
			var self = this;

			if(_.isFunction(func)) 
				func.call(self);

			if(!opt.noFill){
				self.fill = ko.observable();
			}
			if(!opt.noStroke){
				self.stroke = ko.observable();
				self.strokeWidth = ko.observable();
				self.strokeLinecap = ko.observable();
			}

			//transform stuffs
			self.scaleX = ko.observable(1);
			self.scaleY = ko.observable(1);

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
			}

			//set up attr
			self.attr = _(attrKeys)
				.chain()
				.map(function(key){
					return [_(key).dasherize(),self[key]];
				})
				.object().value();

			setOptions.call(self, options || {});

			self.setOptions = _(setOptions).bind(self);
			self.getOptions = _(getOptions).bind(self);
			self.clone = _(clone).bind(self);


		}
		return Shape;
	}
	return Factory;
});
