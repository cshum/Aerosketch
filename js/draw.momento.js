define(["knockout","underscore","draw","util/requestanimationframe"],function(n,e,o,i){var t=[],r=[],u=function(){var n=e(arguments).toArray();e(n).invoke("save"),t.push(n),e(r).each(function(n){e(n).each(function(n){"visible"in n&&"_destroy"in n&&n._destroy(!n.visible())})}),r=[]},a=function(){if(0!==t.length){var n=t.pop();e(n).invoke("undo"),r.push(n)}},s=function(){if(0!==r.length){var n=r.pop();e(n).invoke("redo"),t.push(n)}};e(o).extend({save:u,undo:a,redo:s})});