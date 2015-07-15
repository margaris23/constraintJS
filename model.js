/*
 * model.js
 * Copyright (C) 2015 margaris <margaris@localhost>
 */

//ConstraintBuilder
var ConstraintBuilder = {
    build: function (valFn) {
		if (valFn == null || valFn == undefined || typeof(valFn) !== 'function') {
			throw "Undefined constraint function";
		}
		// TODO we have to also check for number of arguments?
		var Constraint = {
			check: valFn
		};

		Object.defineProperty(Constraint, 'check', {
			enumerable: true,
			configurable: false,
			writable: false
		});

		return Constraint;
	}
};

exports.ConstraintBuilder = ConstraintBuilder;
