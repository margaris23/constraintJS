/*
 * test.js
 * Copyright (C) 2015 margaris <margaris@localhost>
 */
var assert = require("assert");
var Model = require('../model.js');

it('should throw exception with undefined constraint function', function () {
	assert.throws(function () {
		Model.ConstraintBuilder.build();
	},Error);
});

describe('should test a custom "equality" validator constraint', function () {
	var c2 = Model.ConstraintBuilder.build(function (v, against) {
		return !!v && !!against && v === against;
	});
	it('"" eq "test"', function () {
		assert.equal(c2.check('', 'test'), false);
	});
	it('"test" eq "test"', function () {
		assert.equal(c2.check('test', 'test'), true);
	});
	it('empty or no arguments', function () {
		assert.equal(c2.check(), false);
	});
});

return;
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

console.log(validate(Arg));

console.log('Constaint added');

