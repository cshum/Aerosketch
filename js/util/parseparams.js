define([],function(){var n=/([^&=]+)=?([^&]*)/g,r=/\+/g,e=function(n){return decodeURIComponent(n.replace(r," "))};return function(r){var t=r.indexOf("?");if(-1==t)return null;for(var u,i=r.substr(t+1),f={};u=n.exec(i);){var o=e(u[1]),s=e(u[2]);"[]"===o.substring(o.length-2)?(o=o.substring(0,o.length-2),(f[o]||(f[o]=[])).push(s)):f[o]=s}return f}});