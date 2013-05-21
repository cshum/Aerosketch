define([
	'knockout','gapi','draw','draw.firebase'
],function(ko,gapi,Draw){
	var 
	url = ko.observable(),
	update = function(){
		if(Draw.id())
			gapi.client.urlshortener.url.insert({
				'resource': { 'longUrl': 'http://aerosketch.com/app.html?s='+Draw.id()}
			}).execute(function(res){
				if(res.id) url(res.id);
			});
	};
		console.log(gapi);
		gapi.client.setApiKey('AIzaSyAExt6CroSfxehdzSf47nMugcxeuPM54bg');
		gapi.client.load('urlshortener', 'v1',function(){
			if(Draw.id()) update();
			Draw.id.subscribe(update);
		});
	Draw.url = url;
});
