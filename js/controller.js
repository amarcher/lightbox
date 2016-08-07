'use strict';

var ajax = require('./utils/ajax');

var IMGUR_CLIENT_ID = 'f086e2b1e531860';
var IMGUR_SEARCH_URI = 'https://api.imgur.com/3/gallery/search/top/'

var Controller = function(opts) {
  this.view = opts.view;
  this.model = opts.model;

  this.init();
};

Controller.prototype.init = function() {
  this.fetchImages = this.fetchImages.bind(this);
  this.getLightboxImage = this.getLightboxImage.bind(this);
  this._handleImages = this._handleImages.bind(this);
  this._handleError = this._handleError.bind(this);
};

Controller.prototype.bindEvents = function() {
  this.view.bindCallbacks({
    fetchImages: this.fetchImages,
    getLightboxImage: this.getLightboxImage
  });
};

Controller.prototype.fetchImages = function(keyword) {
  this.view.waitForImages();
  this.model.empty();

  return ajax.get(IMGUR_SEARCH_URI, {
    q: 'title: ' + keyword
  }, {
    Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
  }).then(this._handleImages)
    .catch(this._handleError);
};

Controller.prototype.getLightboxImage = function(imageId) {
  return this.model.getLightboxImageData(imageId).then(function(lightboxImageData) {
    this.view.showLightboxForImage(lightboxImageData);
  }.bind(this));
};

Controller.prototype._handleImages = function(imageData) {
  this.model.populate(imageData);
  return this.model.getThumbnailsData()
    .then(function(thumbnailsData) {
      this.view.renderThumbnails(thumbnailsData);
    }.bind(this));
};

Controller.prototype._handleError = function(err) {
  console.log(err);
};

module.exports = Controller;
