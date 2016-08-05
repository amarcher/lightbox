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
