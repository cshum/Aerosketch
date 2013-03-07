define(['knockout','shape/template'],function(ko,Shape){
	if(!ko) return;
	var bbox = {
		read: function(){
			return {
				x: this.x(),
				y: this.y(),
				width: this.width(),
				height: this.height()
			};
		},
		write: function(e){
			if(e.x) this.x(e.x);
			if(e.y) this.y(e.y);
			if(e.width) this.width(e.width);
			if(e.height) this.height(e.height);
		}
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
		attr:['x','y','width','height','rx','ry'],
		options:['x','y','width','height','rx','ry']
	});
});
