define([],function(){return function(t){var x=t.rotate(),y=x*Math.PI/180,i=Math.sin(y),n=Math.cos(y),h=t.bbox();return h&&"x"in h&&"y"in h?(cx=h.x+h.width/2,cy=h.y+h.height/2,_([{x:h.x,y:h.y},{x:h.x+h.width,y:h.y},{x:h.x,y:h.y+h.height},{x:h.x+h.width,y:h.y+h.height}]).map(function(t){var x=t.x-cx,y=t.y-cy;return{x:x*n-y*i+cx,y:x*i+y*n+cy}})):[]}});