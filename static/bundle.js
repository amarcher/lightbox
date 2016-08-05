(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Controller = require('./controller');
var Model = require('./model');
var View = require('./view');

var App = function() {};

App.prototype.onDomReady = function() {
  var searchForm = document.getElementsByClassName('search-form')[0];
  var searchInput = document.getElementsByClassName('search-input')[0];

  var view = new View({
    searchForm: searchForm,
    searchInput: searchInput
  });

  var controller = new Controller({
    model: new Model(),
    view: view
  });

  controller.bindEvents();
};

var app = new App();
document.addEventListener('DOMContentLoaded', app.onDomReady);

},{"./controller":2,"./model":3,"./view":4}],2:[function(require,module,exports){
'use strict';

var Controller = function(opts) {
  this.view = opts.view;
  this.model = opts.model;

  this.init();
};

Controller.prototype.init = function() {
  this.fetchImages = this.fetchImages.bind(this);
  this.getLightboxImage = this.getLightboxImage.bind(this);
};

Controller.prototype.bindEvents = function() {
  this.view.bind({
    fetchImages: this.fetchImages,
    getLightboxImage: this.getLightboxImage
  });
};

Controller.prototype.fetchImages = function(keyword) {
  this.view.waitForImages();
  this.model.empty();
  /* TODO: Add Ajax */
};

Controller.prototype.getLightboxImage = function(imageId) {
  return this.model.getLightboxImageData(imageId).then(function(lightboxImageData) {
    this.view.showLightboxForImage(lightboxImageData);
  }.bind(this));
};

module.exports = Controller;

},{}],3:[function(require,module,exports){
'use strict';

var Model = function(opts) {
  this._images = [];
};

Model.prototype.empty = function() {
  this._images = [];
};

Model.prototype.populate = function(imageData) {
  this._images = imageData;
};

Model.prototype.getThumbnailsData = function() {
  return new Promise(function(resolve, reject) {
    resolve('thumbnailsData');
  });
};

Model.prototype.getLightboxImageData = function(imageId) {
  return new Promise(function(resolve, reject) {
    resolve('imageData');
  });
};

module.exports = Model;

},{}],4:[function(require,module,exports){
'use strict';

var View = function(opts) {
  this._searchForm = opts.searchForm;
  this._searchInput = opts.searchInput;

  this.init();
};

View.prototype.init = function() {
  this._search = this._search.bind(this);
};

View.prototype.bind = function(callbacks) {
  this._fetchImages = callbacks.fetchImages;
  this._getLightboxImage = callbacks.getLightboxImage;

  this._searchForm.addEventListener('submit', this._search);
};

View.prototype.waitForImages = function() {
};

View.prototype.renderThumbnails = function(thumbnailsData) {
};

View.prototype.showLightboxForImage = function(lightboxImageData) {
};

View.prototype._search = function(event) {
  event.preventDefault();

  this._fetchImages(this._searchInput.value);
};

module.exports = View;

},{}]},{},[1]);
