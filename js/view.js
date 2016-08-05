'use strict';

var View = function(opts) {
};

View.prototype.bind = function(callbacks) {
  this._fetchImages = callbacks.fetchImages;
  this._getLightboxImage = callbacks.getLightboxImage;
};

module.exports = View;