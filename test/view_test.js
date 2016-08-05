var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var View = require('../js/view');

describe('View', function() {
  var view;
  var callbacks;

  beforeEach(function() {
    view = new View({});
    callbacks = {
      fetchImages: sinon.stub(),
      getLightboxImage: sinon.stub()
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize', function() {
    chaiAssert.instanceOf(view, View);
  });

  describe('#bind', function() {
    it('should set #_fetchImages and #_getLightboxImage to values passed in callbacks object', function() {
      view.bind(callbacks);

      assert.strictEqual(view._fetchImages, callbacks.fetchImages);
      assert.strictEqual(view._getLightboxImage, callbacks.getLightboxImage);
    });
  });
});
