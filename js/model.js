'use strict';

var Model = function(opts) {
  this._images = [];
};

Model.prototype.empty = function() {
  this._images = [];
};

Model.prototype.populate = function(imageData) {
  this._images = imageData.data.filter(function(image) {
    return !image.is_album;
  });
};

Model.prototype.getThumbnailsData = function() {
  var thumbnailsData = this._images.map(function(image) {
    return {
      id: image.id,
      link: image.link,
      height: image.height,
      width: image.width
    };
  });

  return new Promise(function(resolve, reject) {
    resolve(thumbnailsData);
  });
};

Model.prototype.getLightboxImageData = function(imageId) {
  var imageIndex = this._images.findIndex(function(image) {
    return image.id === imageId
  });
  var image = this._images[imageIndex];
  var lastPossibleIndex = this._images.length - 1;
  var nextImageIndex = imageIndex < lastPossibleIndex ? imageIndex + 1 : 0;
  var prevImageIndex = imageIndex > 0 ? imageIndex - 1 : lastPossibleIndex;
  var nextImageId = this._images[nextImageIndex].id;
  var prevImageId = this._images[prevImageIndex].id;

  return new Promise(function(resolve, reject) {
    resolve({
      id: image.id,
      link: image.link,
      height: image.height,
      width: image.width,
      nextImageId: nextImageId,
      prevImageId: prevImageId
    });
  });
};

module.exports = Model;
