require('jsdom-global')();
var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var View = require('../js/view');

describe('View', function() {
  var view;
  var callbacks;
  var searchForm;
  var searchInput;

  function addSearchFixture() {
    searchForm = document.createElement('form');
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchForm.appendChild(searchInput);
    document.body.appendChild(searchForm);
  }

  beforeEach(function() {
    addSearchFixture();
    view = new View({
      searchForm: searchForm,
      searchInput: searchInput
    });
    callbacks = {
      fetchImages: sinon.stub(),
      getLightboxImage: sinon.stub()
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should initialize with expected properties', function() {
    chaiAssert.instanceOf(view, View);
    chaiAssert.strictEqual(view._searchForm, searchForm);
    chaiAssert.strictEqual(view._searchInput, searchInput);
  });

  describe('#bind', function() {
    beforeEach(() => {
      sinon.stub(searchForm, 'addEventListener');
      view.bind(callbacks);
    });

    it('should set #_fetchImages and #_getLightboxImage to values passed in callbacks object', function() {
      assert.strictEqual(view._fetchImages, callbacks.fetchImages);
      assert.strictEqual(view._getLightboxImage, callbacks.getLightboxImage);
    });

    it('should add a listener to the searchForm with #_search as a callback', function() {
      sinonAssert.calledOnce(searchForm.addEventListener);
      sinonAssert.calledWith(searchForm.addEventListener, 'submit', view._search)
    });
  });

  describe('#waitForImages', function() {
    it('should replace content with a spinner', function() {
    });
  });

  describe('#renderThumbnails', function() {
    it('should render thumbnails with the given thumbnailsData', function() {
    });
  });

  describe('#showLightboxForImage', function() {
    it('should show a lightbox with the given lightboxImageData', function() {
    });
  });

  describe('#_search', function() {
    beforeEach(() => {
      view.bind(callbacks);
    });

    it('should call fetch images with the value of the searchInput', function() {
      searchInput.value = 'sharks';

      searchForm.dispatchEvent(new window.Event('submit'));

      sinonAssert.calledOnce(callbacks.fetchImages);
      sinonAssert.calledWith(callbacks.fetchImages, 'sharks');
    });
  });
});
