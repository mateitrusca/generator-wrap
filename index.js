module.exports = function wrap(genFunc) {

	return function () {
		var gen = genFunc.apply(this, arguments);

		function toPromise(x) {
			if (x !== undefined && x !== null && typeof x.then === 'function') {
				return x;
			} else {
				return {
					then: function (resolve) {
						resolve(x);
					}
				};
			}
		}

		function whileAsync(conditionFn, blockFn) {
			if (conditionFn() === true) {
				setTimeout(function () {
					blockFn();
					whileAsync(conditionFn, blockFn);
				}, 0);
			}
		}

		var possiblePromise = gen.next().value;
		whileAsync(function () {
			return possiblePromise !== undefined;
		}, function () {
			toPromise(possiblePromise).then
			(
				function (promiseValue) {
					possiblePromise = gen.next(promiseValue).value;
				},
				function (rejectionError) {
					possiblePromise = undefined;
					gen.throw(rejectionError);
				}
			);
		});
	}

};
