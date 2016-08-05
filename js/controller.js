'use strict';

var Controller = function(opts) {
  this.view = opts.view;
  this.model = opts.model;
};

Controller.prototype.bindEvents = function() {
  this.view.bind({
    fetchImages: this.fetchImages,
    getLightboxImage: this.getLightboxImage
  });
};

Controller.prototype.fetchImages = function() {
}.bind(this);

Controller.prototype.getLightboxImage = function() {
}.bind(this);

module.exports = Controller;