define([],function(){return function(n){var t=[],e=!1,u=function(){for(var i=0;(!n||i<n)&&t.length>0;)t.shift()(),i++;t.length>0?setTimeout(u,0):e=!1};return function(n){t.push(n),e||(setTimeout(u,0),e=!0)}}});