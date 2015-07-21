/*
 * model.js
 * Copyright (C) 2015 margaris <margaris@localhost>
 */

//ConstraintBuilder
var ConstraintBuilder = {
    build: function (valFn) {
		'using strict';
		if (valFn === null || valFn === undefined || typeof(valFn) !== 'function') {
			throw "Undefined constraint function";
		}
		// TODO we have to also check for number of arguments?
		var Constraint = {
			check: valFn
		};

		// 'check' propery will always be called by validators
		Object.defineProperty(Constraint, 'check', {
			enumerable: true,
			configurable: false,
			writable: false
		});

		return Constraint;
	}
};

// Common Object
var Argument = function (value) {
	this.value = value;
};

// Object.defineProperty(Argument, 'value', {
// 	enumerable: true,
// 	configurable: false,
// 	writable: false
// });

var ArgumentBuilder = {
	build: function (value) {
		return Object.seal(new Argument(value));
	}
};

function isArgument (obj) {
	return obj !== undefined && obj !== null &&
		obj instanceof Argument;
}

exports.isArgument = isArgument;
exports.ConstraintBuilder = ConstraintBuilder;
exports.ArgumentBuilder = ArgumentBuilder;
