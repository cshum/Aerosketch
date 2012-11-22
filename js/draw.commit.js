define(['knockout','underscore','draw'],function(ko,_,Draw){
	var history = [],
		commit = function(){
		},
		undo = function(){
		},
		redo = function(){
		}
	_(Draw).extend({
		commit:commit,
		undo:undo,
		redo:redo
	});
});
