module.exports = function wrap(generatorFunction) {

	return function () {

		// Obtain a generator from the generatorFunction
		let generator = generatorFunction.apply(this, arguments);

		// Asynchronously loop until the generator completes
		(function next(error, result) {
			let generatorResult = undefined;
			if (error !== undefined) {
				generatorResult = generator.throw(error);
			} else {
				generatorResult = generator.next(result);
			}
			if (generatorResult.done === false) {
				Promise.resolve(generatorResult.value)
					.then(
					function (result) {
						setImmediate(function () {
							next(undefined, result);
						});
					},
					function (error) {
						setImmediate(function () {
							next(error);
						});
					}
				);
			}
		})();

	}

};
