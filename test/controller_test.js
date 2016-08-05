var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var Controller = require('../js/controller');

describe('Controller', function() {
  var controller;
  var model;
  var view;

  beforeEach(function() {
    model = {};
    view = {
      bind: sinon.stub()
    };
    controller = new Controller({
      model: model,
      view: view
    })
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize with instances of view and model', function() {
    assert.deepEqual(controller.model, model);
    assert.deepEqual(controller.view, view);
  });

  describe('#bindEvents', function() {
    it('should call view.bind with callbacks', function() {
      controller.bindEvents();

      sinonAssert.calledOnce(view.bind);
      sinonAssert.calledWith(view.bind, {
        fetchImages: controller.fetchImages,
        getLightboxImage: controller.getLightboxImage
      });
    });
  });
});
