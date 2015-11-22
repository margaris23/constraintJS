/* global describe, it */
/*
 * @module test.js
 * @description Copyright (C) 2015 margaris <reverence23@gmail.com>
 */
var assert = require('assert');
var Model = require('../model.js');

describe('No constraint function specified', function () {
    it('should throw exception', function () {
        assert.throws(function () {
            Model.ConstraintBuilder.build();
        },Error);
    });
});

var c2 = Model.ConstraintBuilder.build(function (v, against) {
    return !!v && !!against && v === against;
});

describe('Custom "equality" validator constraint', function () {
    it('"" neq "test"', function () {
        assert.equal(c2.check('', 'test'), false);
    });
    it('"test" eq "test"', function () {
        assert.equal(c2.check('test', 'test'), true);
    });
    it('should return false when empty or no arguments', function () {
        assert.equal(c2.check(), false);
    });
});

// Simple example
//var Required = Model.ConstraintBuilder.build(function (v) {
//    return v !== null && v !== undefined;
//});

// This is the toughest case: we also need to provide type in string format
// i.e TypeOf.check(v, 'function') ... :O !!!
//var TypeOf = Model.ConstraintBuilder.build(function (v) { return undefined; });
// The above could be done differently ... for now


var MyObject = function () {
    this.name = 'default';
};

var InstanceOfMyObject = Model.ConstraintBuilder.build(function (v) {
    // the 2nd arg should be parameterized
    return v instanceof MyObject;
});

// Create a global MyObject
var o = new MyObject();

describe('Instance of MyObject', function () {
    it('should return true', function () {
        assert.equal(InstanceOfMyObject.check(o), true);
    });
});

// FINALLY :) :-) ... oh!!!
// I would prefer strict type safety...
// perhaps it is up to the validator function to handle this
var InstanceOf = Model.ConstraintBuilder.build(function (v, obj) {
    return v instanceof obj;
});

describe('Instanceof constraint check', function () {
    it('of MyObject', function () {
        assert.equal(InstanceOf.check(o, MyObject), true);
    });

    it('of Object', function () {
        assert.equal(InstanceOf.check(o, Object), true);
        // I do not like this! ... but ok for now!
    });
});

// Other object to validate against MyObject
var Other = function (){
    this.name = 'test';
};

describe('InstanceOf Other', function () {
    it('should be false', function () {
        assert.equal(InstanceOf.check(o, Other), false);
        //YESSSSSSSSSSssssssssss!!!!
    });
});

// Ideally
var Arg = {
    value: 'test',
    constraints: {}
};

Arg.constraints[InstanceOf] = [Other];
Arg.constraints[c2] = ['test'];

function validate(obj) {
    var fns = Object.keys(obj.constraints);
    var invalid = false;
    fns.forEach(function (fn) {
        invalid = invalid || !Object.apply(fn, obj.constraints[fn]);
    });
    return !invalid;
}

describe('Validate function embedded in an object (ideally)', function () {
    it('should be true', function () {
        assert.equal(validate(Arg), true);
    });
});

/*

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
*/