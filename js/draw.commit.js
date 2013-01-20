define(['knockout','underscore','draw'],function(ko,_,Draw){
	var map = {},
		undos = [], 
		redos = [],

		push = function(records){
		},
		commit = function(){
			var records = _(arguments).toArray();
			undos.push(records);
			_(redos).each(function(records){
				_(records).invoke('destroy');
			});
			redos = [];
			push(records);
		},
		undo = function(){
			if(undos.length===0) return;
			var records = _(undos.pop()).map(function(record){
				return record.revert();
			});
			redos.push(records);
			push(records);
		},
		redo = function(){
			if(redos.length===0) return;
			var records = _(redos.pop()).map(function(record){
				return record.revert();
			});
			undos.push(records);
			push(records);
		};

	_(Draw).extend({
		commit:commit,
		push:push,
		undo:undo,
		redo:redo
	});
});
