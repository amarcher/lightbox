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
