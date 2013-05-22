define([
	'knockout','jquery','draw','draw.firebase'
],function(ko,$,Draw){
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
	Draw.url = url;
	window.gapiClientOnload = function(){
		gapi.client.setApiKey('AIzaSyAExt6CroSfxehdzSf47nMugcxeuPM54bg');
		gapi.client.load('urlshortener', 'v1',function(){
			if(Draw.id()) update();
			Draw.id.subscribe(update);
		});
	};
	require(['https://apis.google.com/js/client.js?onload=gapiClientOnload']);
});
