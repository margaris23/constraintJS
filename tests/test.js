/*
 * test.js
 * Copyright (C) 2015 margaris <reverence23@gmail.com>
 */
var Model = require('../model.js');

console.log('the test below should catch the exception!');
try {
	var c1 = Model.ConstraintBuilder.build();
	console.log(c1);
} catch (e) {
	console.log('Success!');
}

console.log('the test below should create a custom function validator constraint');
var c2 = Model.ConstraintBuilder.build(function (v, against) { return v === against; });
console.log(c2);
console.log(c2.check('', 'test'));
console.log(c2.check('test', 'test'));


console.log('fails (but assignment does not work! ... accepted for now)');
try {
	c2.check = 'this should throw exception';
	console.log(c2.check());
	console.log('Acceptable for now if reply is false');
} catch (e) {
	console.log('Success!');
}

console.log('\n REAL EXAMPLES \n');

// Simple example
var Required = Model.ConstraintBuilder.build(function (v) {
	return v !== null && v !== undefined;
});

// This is the toughest case: we also need to provide type in string format
// i.e TypeOf.check(v, 'function') ... :O !!!
var TypeOf = Model.ConstraintBuilder.build(function (v) { return undefined; });
// The above could be done differently ... for now

// Another tough one is instanceOf
var MyObject = function () {
	this.name = "default";
};
var o = new MyObject();
console.log('Instance of MyObject: ' + (o instanceof MyObject));
console.log(o.name);


var InstanceOfMyObject = Model.ConstraintBuilder.build(function (v) {
	return v instanceof MyObject; // the 2nd arg should be parameterized
});
console.log(InstanceOfMyObject.check(o));


// FINALLY :) :-) ... oh!!!
var InstanceOf = Model.ConstraintBuilder.build(function (v, obj) {
   return v instanceof obj;
});
console.log(InstanceOf.check(o, MyObject));
// I would prefer strict type safety...
// perhaps it is up to the validator function to handle this
console.log(InstanceOf.check(o, Object)); // I do not like this! ... but ok for now

var Other = function (){
	this.name = "test";
};
console.log('InstanceOf Other: ' + InstanceOf.check(o, Other));
// YESSSSSSSSSSssssssssss!!!!

// Ideally
var Arg = {
	value: 'test',
	constraints: {}
};

Arg.constraints[InstanceOf] = [Other];
Arg.constraints[c2] = ['test'];

function validate(obj) {
	fns = Object.keys(obj.constraints);
	var invalid = false;
	fns.forEach(function (fn) {
		invalid = invalid || !Object.apply(fn, obj.constraints[fn]);
	});
	return !invalid;
}

console.log('Validate: ' + validate(Arg));


// more concrete examples
// Constraint Function
var iof = function () {
	// the following 3 lines need to be parameterized
	// via builder pattern.
	if (!arguments || arguments.length === 0) {
		throw new Error("Not enough arguments");
	}

	// make sure object is not array and
	// has Argument.prototype in its prototype chain
	if (!Array.isArray(this) && Model.isArgument(this)) {
		if (typeof(arguments[0]) === 'object') {
			throw new TypeError("Invalid type: [object]!");
		}

		// String literals should also be checked with typeof
		if (arguments[0] === String) {
			return this.value instanceof String ||
					typeof(this.value) === "string";
		}

		// This is the main implementation
		return this.value instanceof arguments[0];
	} else {
		throw new Error("Object not instance of 'Argument'");
	}
};

// the 'iof' above is a better implementation
var between = function () {
	if (!arguments || arguments.length < 2) {
		throw "Not enough arguments";
	}
	var min = arguments[0],
		max = arguments[1];
	return this > min && this < max;
};

try {
	console.log("Arg.iof(Other)");
	iof.apply(Arg, [Other]);
} catch (e) { console.log(e); }

try {
	console.log("Arg.iof()");
  iof.apply(Arg, []);
} catch (e) { console.log(e); }

try {
	console.log("Arg.iof(String)");
  iof.apply(Arg, [String]);
} catch (e) { console.log(e); }

console.log("\n'haha' instance of String: " + ('haha' instanceof String));
console.log("\nLET's SEE!!!\n");
var arg2 = Model.ArgumentBuilder.build("test");
console.log("arg2.iof(String): " + iof.apply(arg2, [String]));

// the following currently throws TypeError
try {
	console.log("arg2.iof(arg2): " + iof.apply(arg2, [arg2]));
} catch (e) {
	console.log(e);
}
