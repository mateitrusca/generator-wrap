var wrap = require('../');

wrap(function*(){
	process.exit(0);
})();

setTimeout(function(){
	process.exit(1);
}, 100);
