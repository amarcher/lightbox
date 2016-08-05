var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
require('sinon-as-promised');
var Model = require('../js/model');

describe('Model', function() {
  var model;

  beforeEach(function() {
    model = new Model({});
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize with an empty array of images', function() {
    chaiAssert.instanceOf(model, Model);
    assert.deepEqual(model._images, []);
  });

  describe('#empty', function() {
    it('should set its _images property to an empty array', function() {
      model._images = ['image'];

      model.empty();

      assert.deepEqual(model._images, []);
    });
  });

  describe('#populate', function() {
    var imageData = ['imageData'];

    it('should set its _images property to an imageData', function() {
      model.populate(imageData);

      assert.deepEqual(model._images, imageData);
    });
  });

  describe('#getLightboxImageData', function() {
    it('should return a Promise that resolves with imageData', function() {
      return model.getLightboxImageData(1234).then(function(lightboxImageData) {
        assert.strictEqual(lightboxImageData, 'imageData');
      });
    });
  });
});
