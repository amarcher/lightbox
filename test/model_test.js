var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var Model = require('../js/model');

describe('Model', function() {
  var model;

  beforeEach(function() {
    model = new Model({});
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize', function() {
    chaiAssert.instanceOf(model, Model);
  });
});
