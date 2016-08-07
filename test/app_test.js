'use strict';

require('jsdom-global')();
var Controller = require('../js/controller');
var Model = require('../js/model');
var View = require('../js/view');
var assert = require('assert');
var chaiAssert = require('chai').assert;
var sinonAssert = require('sinon').assert;
var sinon = require('sinon').sandbox.create();
var fixtures = require('./utils/fixtures');

describe('App', function() {
  var app;
  var searchForm;
  var searchInput;
  var thumbnailContentArea;
  var lightboxOverlay;
  var lightboxImage;
  var noResultsErrorMessage;
  var spinner;

  function addFixtures() {
    document.body.innerHTML = fixtures.html;
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
    sinon.stub(document, 'addEventListener');
    app = require('../js/App');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('sets a listener on document ready', function() {
    sinonAssert.calledOnce(document.addEventListener);
    sinonAssert.calledWith(document.addEventListener, 'DOMContentLoaded', app.onDomReady);
  });

  describe('onDomReady', function() {
    beforeEach(function() {
      sinon.stub(Controller.prototype, 'bindEvents');
      app.onDomReady();
    });

    it('creates an instance of View with correct properties', function() {
      chaiAssert.instanceOf(app.view, View);
      assert.strictEqual(app.view._searchForm, searchForm);
      assert.strictEqual(app.view._searchInput, searchInput);
      assert.strictEqual(app.view._thumbnailContentArea, thumbnailContentArea);
      assert.deepEqual(app.view._lightboxOverlay, lightboxOverlay);
      assert.deepEqual(app.view._lightboxImage, lightboxImage);
      assert.deepEqual(app.view._noResultsErrorMessage, noResultsErrorMessage);
      assert.deepEqual(app.view._spinner, spinner);
    });

    it('creates an instance of Model', function() {
      chaiAssert.instanceOf(app.model, Model);
    });

    it('creates an instance of Controller with model and view', function() {
      chaiAssert.instanceOf(app.controller, Controller);
      assert.deepEqual(app.controller.view, app.view);
      assert.deepEqual(app.controller.model, app.model);
    });

    it('calls controller#bindEvents', function() {
      sinonAssert.calledOnce(app.controller.bindEvents);
    });
  });
});