define([
'knockout','underscore','jquery','jquery.qrcode'
],function(ko,_,$){
	ko.bindingHandlers.qrcode = {
		update: function(el,access) {
			var text = ko.utils.unwrapObservable(access());
			if(text)
				$(el).qrcode({
					width: $(el).width(),
					height: $(el).height(),
					text: text
				});
			}
	};
});

