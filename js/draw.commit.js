define(['knockout','underscore','draw'],function(ko,_,Draw){
	var map = {},
		undos = [], 
		redos = [],

		save = function(records){
		},
		commit = function(){
			var records = _(arguments).toArray();
			undos.push(records);
			redos = [];
			save(records);
		},
		undo = function(){
			if(undos.length===0) return;
			var records = _(undos.pop()).map(function(record){
				return record.revert();
			});
			redos.push(records);
			save(records);
		},
		redo = function(){
			if(redos.length===0) return;
			var records = _(redos.pop()).map(function(record){
				return record.revert();
			});
			undos.push(records);
			save(records);
		};

	_(Draw).extend({
		commit:commit,
		save:save,
		undo:undo,
		redo:redo
	});
});
