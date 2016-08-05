var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
require('sinon-as-promised');
var Controller = require('../js/controller');

describe('Controller', function() {
  var controller;
  var model;
  var view;

  beforeEach(function() {
    model = {
      empty: sinon.stub(),
      getLightboxImageData: sinon.stub()
    };
    view = {
      bind: sinon.stub(),
      waitForImages: sinon.stub(),
      showLightboxForImage: sinon.stub()
    };
    controller = new Controller({
      model: model,
      view: view
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize with instances of view and model', function() {
    assert.deepEqual(controller.model, model);
    assert.deepEqual(controller.view, view);
  });

  describe('#bindEvents', function() {
    beforeEach(function() {
      controller.bindEvents();
    });

    it('should call view.bind with callbacks', function() {
      sinonAssert.calledOnce(view.bind);
      sinonAssert.calledWith(view.bind, {
        fetchImages: controller.fetchImages,
        getLightboxImage: controller.getLightboxImage
      });
    });
  });

  describe('#fetchImages', function() {
    beforeEach(function() {
      controller.fetchImages('sharks');
    });

    it('calls view#waitForImages', function() {
      sinonAssert.calledOnce(view.waitForImages);
    });

    it('calls model#empty', function() {
      sinonAssert.calledOnce(model.empty);
    });
  });

  describe('#getLightboxImage', function() {
    var lightBoxImageData;

    beforeEach(function() {
      lightBoxImageData = {
        imageId: 1234,
        imageUrl: '/home.png',
        nextImageId: 1235,
        prevImageId: 1233,
      };
      model.getLightboxImageData.resolves(lightBoxImageData);
    });

    it('calls model#getLightboxImageData', function() {
      return controller.getLightboxImage(1234).then(function() {
        sinonAssert.calledOnce(model.getLightboxImageData);
        sinonAssert.calledWith(model.getLightboxImageData, 1234);
      });
    });

    it('calls view#showLightboxForImage', function() {
      return controller.getLightboxImage(1234).then(function() {
        sinonAssert.calledOnce(view.showLightboxForImage);
        sinonAssert.calledWith(view.showLightboxForImage, lightBoxImageData);
      });
    });
  });
});
