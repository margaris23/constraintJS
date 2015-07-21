/*
 * test.js
 * Copyright (C) 2015 margaris <margaris@localhost>
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
var Required = Model.ConstraintBuilder.build(function (v) { return v !== null && v !== undefined; });
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
// I would prefer strict type safety...perhaps it is up to the validator function to handle this
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
