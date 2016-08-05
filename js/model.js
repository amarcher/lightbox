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
