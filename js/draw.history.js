define(['knockout','underscore','draw'],function(ko,_,Draw){
	var undos = [], 
		redos = [],
		commit = function(){
			var record = _(arguments).toArray();
			_(record).invoke('commit');
			undos.push(record);
			/*
			_(redos).each(function(record){
				_(record).invoke('_destroy',true);
			});
			*/
			redos = [];
		},
		undo = function(){
			if(undos.length===0) return;
			var record = undos.pop();
			_(record).invoke('undo');
			redos.push(record);
		},
		redo = function(){
			if(redos.length===0) return;
			var record = redos.pop();
			_(record).invoke('redo');
			undos.push(record);
		};

	_(Draw).extend({
		commit:commit,
		undo:undo,
		redo:redo
	});
});
