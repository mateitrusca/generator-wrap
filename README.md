# generator-wrap [![Build Status](https://travis-ci.org/sqreept/generator-wrap.svg)](https://travis-ci.org/sqreept/generator-wrap)

 Wrapper for generators to transform them in coroutines.
 
## Installation

```js
$ npm install generator-wrap
```

## Example

```js
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
```

## API

### wrap(generatorFunction)

Wraps the generator in a function that is returned. When the function is executed, yielded values are treated as promises and their resolved values or their rejected errors are passed back in the generator.

## License

  MIT
