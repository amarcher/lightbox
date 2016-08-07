var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
require('sinon-as-promised');
var Controller = require('../js/controller');
var fixtures = require('./utils/fixtures')
var ajax = require('../js/utils/ajax');

describe('Controller', function() {
  var controller;
  var model;
  var view;

  beforeEach(function() {
    model = {
      empty: sinon.stub(),
      populate: sinon.stub(),
      getLightboxImageData: sinon.stub(),
      getThumbnailsData: sinon.stub()
    };
    view = {
      bind: sinon.stub(),
      renderThumbnails: sinon.stub(),
      waitForImages: sinon.stub(),
      showLightboxForImage: sinon.stub()
    };
    controller = new Controller({
      model: model,
      view: view
    });

    sinon.stub(ajax, 'get');
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
      sinon.stub(controller, '_handleImages');
      sinon.stub(controller, '_handleError');
      ajax.get.resolves(fixtures.imageData);
      return controller.fetchImages('sharks');
    });

    it('calls view#waitForImages', function() {
      sinonAssert.calledOnce(view.waitForImages);
    });

    it('calls model#empty', function() {
      sinonAssert.calledOnce(model.empty);
    });

    it('calls ajax#get with correct arguments', function() {
      sinonAssert.calledOnce(ajax.get);
      sinonAssert.calledWith(ajax.get, 'https://api.imgur.com/3/gallery/search/top/', {
          q: 'title: sharks'
        }, {
          Authorization: 'Client-ID f086e2b1e531860'
        });
    });

    it('calls #_handleImages with result', function() {
      sinonAssert.calledOnce(controller._handleImages);
      sinonAssert.calledWith(controller._handleImages, fixtures.imageData);
    });

    it('calls #_handleError', function() {
      ajax.get.rejects('error');

      return controller.fetchImages('sharks').then(function() {
        sinonAssert.calledOnce(controller._handleError);
      });
    })
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

  describe('#_handleImages', function() {
    beforeEach(() => {
      model.getThumbnailsData.resolves([fixtures.thumbnailImage]);
      return controller._handleImages(fixtures.imageData);
    });

    it('calls model#populate with response', function() {
      sinonAssert.calledOnce(model.populate);
      sinonAssert.calledWith(model.populate, fixtures.imageData);
    });

    it('calls model#getThumbnailsData', function() {
      sinonAssert.calledOnce(model.getThumbnailsData);
    });

    it('calls view#renderThumbnails with result', function() {
      sinonAssert.calledOnce(model.getThumbnailsData);
      sinonAssert.calledWith(view.renderThumbnails, [fixtures.thumbnailImage]);
    });
  });
});
