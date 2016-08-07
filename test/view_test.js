'use strict';

require('jsdom-global')();
var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var View = require('../js/view');
var fixtures = require('./utils/fixtures')

describe('View', function() {
  var view;
  var callbacks;
  var searchForm;
  var searchInput;
  var thumbnailContentArea;
  var lightboxOverlay;
  var lightboxImage;
  var noResultsErrorMessage;
  var spinner;

  function addFixtures() {
    document.body.innerHTML = '\
      <header class="header">\
        <span class="logo">Lightbox</span>\
        <form class="search-form">\
          <input class="search-input" placeholder="Search" type="text" />\
          <button class="search-button">\
            Go!\
          </button>\
        </form>\
      </header>\
      <section class="content-area">\
        <div class="thumbnail-content-area">\
        </div>\
      </section>\
      <div class="hidden">\
        <div class="lightbox-overlay">\
          <div class="lightbox">\
            <a href="javascript:void(0)" class="lightbox-close">X</a>\
            <a href="javascript:void(0)" class="prev">◀</a>\
            <a href="javascript:void(0)" class="next">▶</a>\
            <img class="lightbox-image" />\
          </div>\
        </div>\
        <div class="error no-results-error">Found no images for that search term. Please try a different one.</div>\
        <div class="spinner"></div>\
      </div>\
    ';
    searchForm = document.getElementsByClassName('search-form')[0];
    searchInput = document.getElementsByClassName('search-input')[0];
    thumbnailContentArea = document.getElementsByClassName('thumbnail-content-area')[0];
    lightboxOverlay = document.getElementsByClassName('lightbox-overlay')[0];
    lightboxImage = document.getElementsByClassName('lightbox-image')[0];
    noResultsErrorMessage = document.getElementsByClassName('no-results-error')[0];
    spinner = document.getElementsByClassName('spinner')[0];
  }

  beforeEach(function() {
    addFixtures();
    view = new View({
      searchForm: searchForm,
      searchInput: searchInput,
      thumbnailContentArea: thumbnailContentArea,
      lightboxOverlay: lightboxOverlay,
      lightboxImage: lightboxImage,
      noResultsErrorMessage: noResultsErrorMessage,
      spinner: spinner
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
    chaiAssert.strictEqual(view._thumbnailContentArea, thumbnailContentArea);
    chaiAssert.strictEqual(view._lightboxOverlay, lightboxOverlay);
    chaiAssert.strictEqual(view._lightboxImage, lightboxImage);
    chaiAssert.strictEqual(view._noResultsErrorMessage, noResultsErrorMessage);
    chaiAssert.strictEqual(view._spinner, spinner);
  });

  describe('#bindCallbacks', function() {
    beforeEach(function() {
      sinon.stub(searchForm, 'addEventListener');
      sinon.stub(lightboxOverlay, 'addEventListener');
      sinon.stub(thumbnailContentArea, 'addEventListener');
      view.bindCallbacks(callbacks);
    });

    it('should set #_fetchImages and #_getLightboxImage to values passed in callbacks object', function() {
      assert.strictEqual(view._fetchImages, callbacks.fetchImages);
      assert.strictEqual(view._getLightboxImage, callbacks.getLightboxImage);
    });

    it('should add a listener to the searchForm with #_search as a callback', function() {
      sinonAssert.calledOnce(searchForm.addEventListener);
      sinonAssert.calledWith(searchForm.addEventListener, 'submit', view._search);
    });

    it('should add a listener to the lightboxOverlay with #_handleLightboxClick as a callback', function() {
      sinonAssert.calledOnce(lightboxOverlay.addEventListener);
      sinonAssert.calledWith(lightboxOverlay.addEventListener, 'click', view._handleLightboxClick);
    });

    it('should add a listener to the thumbnailContentArea with #_openLightBox as a callback', function() {
      sinonAssert.calledOnce(thumbnailContentArea.addEventListener);
      sinonAssert.calledWith(thumbnailContentArea.addEventListener, 'click', view._openLightBox);
    });
  });

  describe('#waitForImages', function() {
    it('should replace content in thumbnail content area with a spinner', function() {
      view.waitForImages();

      var thumbnailArea = document.getElementsByClassName('thumbnail-content-area')[0];
      assert.strictEqual(thumbnailArea.children.length, 1);
      chaiAssert.isDefined(thumbnailArea.getElementsByClassName('spinner')[0]);
    });
  });

  describe('#renderThumbnails', function() {
    context('with empty thumbnailsData', function() {
      beforeEach(function() {
        view.renderThumbnails([]);
      });

      it('should put "no results" error message into the content area', function() {
        var thumbnailArea = document.getElementsByClassName('thumbnail-content-area')[0];
        assert.strictEqual(thumbnailArea.children.length, 1);
        chaiAssert.isDefined(thumbnailArea.getElementsByClassName('no-results-error')[0]);
      });
    });

    context('with thumbnailsData', function() {
      var thumbnail;

      beforeEach(function() {
        thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail-image';
        sinon.stub(view, '_createThumbnailImage');
        view._createThumbnailImage.returns(thumbnail);
        view.renderThumbnails([fixtures.thumbnailImage]);
      });

      it('should call _createThumbnailImage once for each thumbnail', function() {
        sinonAssert.calledOnce(view._createThumbnailImage);
        sinonAssert.calledWith(view._createThumbnailImage, fixtures.thumbnailImage);
      });

      it('should render the created thumbnails into the thumbnail content area', function() {
        var thumbnailArea = document.getElementsByClassName('thumbnail-content-area')[0];
        assert.strictEqual(thumbnailArea.children.length, 1);
        chaiAssert.isDefined(thumbnailArea.getElementsByClassName('thumbnail-image')[0]);
      });
    });
  });

  describe('#showLightboxForImage', function() {
    beforeEach(function() {
      sinon.stub(document.body, 'appendChild');
      view._lightboxOpened = true;
      view.showLightboxForImage(fixtures.lightboxImageData);
    });

    it('should set its lightboxImageData property', function() {
      assert.deepEqual(view._lightboxImageData, fixtures.lightboxImageData);
    });

    it('should set the lightbox image source', function() {
      assert.strictEqual(view._lightboxImage.src, fixtures.lightboxImageData.link);
    });

    it('should set its lightboxOpened property to true', function() {
      assert.strictEqual(view._lightboxOpened, true);
    });

    context('when the lightbox is opened', function() {
      it('should not append its lightbox overlay to the document body', function() {
        sinonAssert.notCalled(document.body.appendChild);
      });
    });

    context('when the lightbox is closed', function() {
      beforeEach(() => {
        view._lightboxOpened = false;
        view.showLightboxForImage(fixtures.lightboxImageData);
      });

      it('should not append its lightbox overlay to the document body', function() {
        sinonAssert.calledOnce(document.body.appendChild);
        sinonAssert.calledWith(document.body.appendChild, view._lightboxOverlay);
      });
    });
  });

  describe('#_search', function() {
    beforeEach(function() {
      view.bindCallbacks(callbacks);
    });

    it('should call fetch images with the value of the searchInput', function() {
      searchInput.value = 'sharks';

      searchForm.dispatchEvent(new window.Event('submit'));

      sinonAssert.calledOnce(callbacks.fetchImages);
      sinonAssert.calledWith(callbacks.fetchImages, 'sharks');
    });
  });

  describe('#_openLightBox', function() {
    var evt;

    beforeEach(function() {
      view.bindCallbacks(callbacks);
      evt = {
        target: {
          id: '1234'
        }
      }
    });

    context('when passed an event with the loaded thumbnail image classname', function() {
      beforeEach(() => {
        evt.target.className = 'thumbnail-image loaded';
        view._openLightBox(evt);
      });

      it('should call #_getLightboxImage with the id of the event target', function() {
        sinonAssert.calledOnce(callbacks.getLightboxImage);
        sinonAssert.calledWith(callbacks.getLightboxImage, '1234');
      });
    });

    context('when passed an event that does not have the loaded thumbnail image classname', function() {
      beforeEach(() => {
        evt.target.className = 'thumbnail-image';
        view._openLightBox(evt);
      });

      it('should not call #_getLightboxImage', function() {
        sinonAssert.notCalled(callbacks.getLightboxImage);
      });
    });
  });

  describe('#_closeLightbox', function() {
    beforeEach(() => {
      sinon.stub(document.body, 'removeChild');
      view._closeLightbox();
    });

    it('removes the lightboxOverlay', function() {
      sinonAssert.calledOnce(document.body.removeChild);
      sinonAssert.calledWith(document.body.removeChild, lightboxOverlay);
    });

    it('should set its lightboxOpened property to false', function() {
      assert.strictEqual(view._lightboxOpened, false);
    });
  });

  describe('#_createThumbnailImage', function() {
    var img;
    var div;

    beforeEach(() => {
      img = document.createElement('img');
      div = document.createElement('div');
      sinon.stub(document, 'createElement');
      sinon.stub(img, 'addEventListener');
      document.createElement.withArgs('img').returns(img);
      document.createElement.withArgs('div').returns(div);
    });

    it('returns a thumbnail image div with correct properties', function() {
      var thumbnailImage = view._createThumbnailImage(fixtures.thumbnailImage, 0);
      assert.strictEqual(thumbnailImage.className, 'thumbnail-image');
      assert.strictEqual(thumbnailImage.id, fixtures.thumbnailImage.id);
      assert.strictEqual(thumbnailImage.style.backgroundImage, 'url(' + fixtures.thumbnailImage.link + ')');
    });

    it('adds an event listener to #applyLoadedClassName on load', function() {
      view._createThumbnailImage(fixtures.thumbnailImage, 0);
      sinonAssert.calledOnce(img.addEventListener);
      sinonAssert.calledWith(img.addEventListener, 'load');
    });
  });

  describe('#_handleLightboxClick', function() {
    var evt;

    beforeEach(() => {
      sinon.stub(view, '_closeLightbox');
      view.bindCallbacks(callbacks);
      view.showLightboxForImage(fixtures.lightboxImageData);

      evt = {
        stopPropagation: sinon.stub(),
        target: {}
      };
    });

    context('with an unspecified target', function() {
      beforeEach(() => {
        evt.target.className = 'default';
        view._handleLightboxClick(evt);
      });

      it('does not stop event propagation', function() {
        sinonAssert.notCalled(evt.stopPropagation);
      });

      it('does not close the lightbox', function() {
        sinonAssert.notCalled(view._closeLightbox);
      });

      it('does not get a new lightbox image', function() {
        sinonAssert.notCalled(callbacks.getLightboxImage);
      });
    });

    context('with the lightbox as a target', function() {
      beforeEach(() => {
        evt.target.className = 'lightbox';
        view._handleLightboxClick(evt);
      });

      it('stops event propagation', function() {
        sinonAssert.calledOnce(evt.stopPropagation);
      });

      it('does not close the lightbox', function() {
        sinonAssert.notCalled(view._closeLightbox);
      });

      it('does not get a new lightbox image', function() {
        sinonAssert.notCalled(callbacks.getLightboxImage);
      });
    });

    context('with "next" as a target', function() {
      beforeEach(() => {
        evt.target.className = 'next';
        view._handleLightboxClick(evt);
      });

      it('stops event propagation', function() {
        sinonAssert.calledOnce(evt.stopPropagation);
      });

      it('does not close the lightbox', function() {
        sinonAssert.notCalled(view._closeLightbox);
      });

      it('gets a new lightbox image', function() {
        sinonAssert.calledOnce(callbacks.getLightboxImage);
        sinonAssert.calledWith(callbacks.getLightboxImage, fixtures.lightboxImageData.nextImageId);
      });
    });

    context('with "prev" as a target', function() {
      beforeEach(() => {
        evt.target.className = 'prev';
        view._handleLightboxClick(evt);
      });

      it('stops event propagation', function() {
        sinonAssert.calledOnce(evt.stopPropagation);
      });

      it('does not close the lightbox', function() {
        sinonAssert.notCalled(view._closeLightbox);
      });

      it('gets a new lightbox image', function() {
        sinonAssert.calledOnce(callbacks.getLightboxImage);
        sinonAssert.calledWith(callbacks.getLightboxImage, fixtures.lightboxImageData.prevImageId);
      });
    });

    context('with lightbox overlay as a target', function() {
      beforeEach(() => {
        evt.target.className = 'lightbox-overlay';
        view._handleLightboxClick(evt);
      });

      it('closes the lightbox', function() {
        sinonAssert.calledOnce(view._closeLightbox);
      });

      it('does not get a new lightbox image', function() {
        sinonAssert.notCalled(callbacks.getLightboxImage);
      });
    });

    context('with lightbox close button as a target', function() {
      beforeEach(() => {
        evt.target.className = 'lightbox-close';
        view._handleLightboxClick(evt);
      });

      it('closes the lightbox', function() {
        sinonAssert.calledOnce(view._closeLightbox);
      });

      it('does not get a new lightbox image', function() {
        sinonAssert.notCalled(callbacks.getLightboxImage);
      });
    });
  });
});
