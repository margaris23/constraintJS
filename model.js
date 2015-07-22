/*
 * model.js
 * Copyright (C) 2015 margaris <reverence23@gmail.com>
 */

// Constraint Object
var Constraint = function(valFn, numOfArgs) {
	this.check = valFn;
	this.noa = numOfArgs;	// for now lets consider them valid
};

//ConstraintBuilder
var ConstraintBuilder = {
    build: function (valFn, numOfArgs) {
		'using strict';
		if (valFn === null || valFn === undefined ||
			typeof(valFn) !== 'function') {
			throw new Error("Undefined constraint function");
		}

		// 'check' propery will always be called by validators
		// Object.defineProperty(Constraint, 'check', {
		// 	enumerable: true,
		// 	configurable: false,
		// 	writable: false
		// });

		return Object.seal(new Constraint(valFn, numOfArgs));
	}
};

// Argument Object:
// it must me minimal and not extendable
var Argument = function (value) {
	this.value = value;
};

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
