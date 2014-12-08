module.exports = function wrap(genFunc) {

	return function () {
		let gen = genFunc.apply(this, arguments);

		function toPromise(x) {
			if (x !== undefined && x !== null && typeof x.then === 'function') {
				return x;
			} else {
				return Promise.resolve(x);
			}
		}

		function next(err, result) {
			let generatorResult = undefined;
			if (err !== undefined) {
				generatorResult = gen.throw(err);
			} else {
				generatorResult = gen.next(result);
			}
			if (generatorResult.done === false) {
				toPromise(generatorResult.value)
					.then(
					function (result) {
						setImmediate(function () {
							next(undefined, result);
						});
					},
					function (err) {
						setImmediate(function () {
							next(err);
						});
					}
				);
			}
		}

		next();

	}

};
