define(['knockout','shape/factory'],function(ko,Shape){
	var bbox = {
		read: function(){
			return {
				x: this.x(),
				y: this.y(),
				width: this.width(),
				height: this.height()
			}
		},
		write: function(e){
			_(e).defaults(this.bbox());
			this.x(e.x);
			this.y(e.y);
			this.width(e.width);
			this.height(e.height);
		},
	};
	return Shape('rect',function(){
		this.x = ko.observable();
		this.y = ko.observable();
		this.width = ko.observable();
		this.height = ko.observable();
		this.rx = ko.observable();
		this.ry = ko.observable();
		this.bbox = ko.computed(bbox,this);
	},{
		attr:['x','y','width','height','rx','ry']
	});
});
