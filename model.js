/*
 * model.js
 * Copyright (C) 2015 margaris <margaris@localhost>
 */

//ConstraintBuilder
var ConstraintBuilder = {
    build: function (valFn) {
		'using strict';
		if (valFn == null || valFn == undefined || typeof(valFn) !== 'function') {
			throw new Error("Undefined constraint function");
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

var ArgumentBuilder = {
	build: function () {
		'using strict';
		var Argument = {};
		return Argument;
	}
};

exports.ConstraintBuilder = ConstraintBuilder;
exports.ArgumentBuilder = ArgumentBuilder;
