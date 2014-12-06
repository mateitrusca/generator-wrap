var wrap = require('generator-wrap');

function someAsyncOperation() {
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			resolve(3.1415);
		}, 1000);
	});
}

wrap(function*(){
	console.log('Hello World from a coroutine!');
	var asyncObtainedValue = yield someAsyncOperation();
	console.log('Async Value: '+asyncObtainedValue);
})();
