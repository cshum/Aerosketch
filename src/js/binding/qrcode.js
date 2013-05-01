define([
'knockout','underscore','jquery','jquery.qrcode'
],function(ko,_,$){
	ko.bindingHandlers.qrcode = {
		update: function(el,access) {
			$(el).qrcode({
				width: $(el).width(),
				height: $(el).height(),
				text: ko.utils.unwrapObservable(access())
			});
		}
	};
});

