'use strict';

var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinon = require('sinon').sandbox.create();
require('sinon-as-promised');
var Model = require('../js/model');
var fixtures = require('./utils/fixtures');

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
    it('should set its _images property to the non-album images in imageData', function() {
      model.populate(fixtures.imageData);

      assert.deepEqual(model._images, [fixtures.image]);
    });
  });

  describe('#getThumbnailsData', function() {
    beforeEach(function() {
      model.populate(fixtures.imageData);
    });

    it('should return a Promise that resolves with thumbnailsData', function() {
      var image = fixtures.image;

      return model.getThumbnailsData().then(function(thumbnailsData) {
        assert.deepEqual(thumbnailsData, [{
          id: image.id,
          link: image.link,
          height: image.height,
          width: image.width
        }]);
      });
    });
  });

  describe('#getLightboxImageData', function() {
    var image1 = Object.assign({}, fixtures.image, { id: 'image1' });
    var image2 = Object.assign({}, fixtures.image, { id: 'image2' });
    var image3 = Object.assign({}, fixtures.image, { id: 'image3' });

    beforeEach(function() {
      model.populate({
        data: [image1, image2, image3]
      });
    });

    it('should resolve with the expected image data for the first image in the set', function() {
      return model.getLightboxImageData(image1.id).then(function(lightboxImageData) {
        assert.deepEqual(lightboxImageData, {
          id: image1.id,
          link: image1.link,
          height: image1.height,
          width: image1.width,
          nextImageId: image2.id,
          prevImageId: image3.id
        });
      });
    });

    it('should resolve with the expected image data for a middle image in the set', function() {
      return model.getLightboxImageData(image2.id).then(function(lightboxImageData) {
        assert.deepEqual(lightboxImageData, {
          id: image2.id,
          link: image2.link,
          height: image2.height,
          width: image2.width,
          nextImageId: image3.id,
          prevImageId: image1.id
        });
      });
    });

    it('should resolve with the expected image data for a middle image in the set', function() {
      return model.getLightboxImageData(image3.id).then(function(lightboxImageData) {
        assert.deepEqual(lightboxImageData, {
          id: image3.id,
          link: image3.link,
          height: image3.height,
          width: image3.width,
          nextImageId: image1.id,
          prevImageId: image2.id
        });
      });
    });
  });
});
