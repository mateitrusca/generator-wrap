module.exports = function wrap(genFunc) {

	return function () {
		var gen = genFunc.apply(this, arguments);

		function toPromise(x) {
			if (x !== undefined && x !== null && typeof x.then === 'function') {
				return x;
			} else {
				return new Promise(
					function (resolve) {
						resolve(x);
					}
				);
			}
		}

		function whileAsync(conditionFn, blockFn) {
			if (conditionFn() === true) {
				setImmediate(function () {
					blockFn();
					whileAsync(conditionFn, blockFn);
				}, 0);
			}
		}

		var exceptionThrown = false;
		try {
			var generatorResult = gen.next();
		} catch(err) {
			exceptionThrown = true;
			gen.throw(rejectionError);
		}
		whileAsync(function () {
			if(generatorResult.done || exceptionThrown) {
				gen.close();
				return false;
			}
			return true;
		}, function () {
			toPromise(generatorResult.value).then
			(
				function (promisedValue) {
					try {
						generatorResult = gen.next(promisedValue);
					} catch(err) {
						exceptionThrown = true;
						gen.throw(rejectionError);
					}
				},
				function (rejectionError) {
					exceptionThrown = true;
					gen.throw(rejectionError);
				}
			);
		});
	}

};
