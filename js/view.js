'use strict';

var THUMBNAIL_IMAGE_CLASSNAME = 'thumbnail-image';
var LOADED_THUMBNAIL_IMAGE_CLASSNAME = 'thumbnail-image loaded';
var LIGHTBOX_CLASSNAME = 'lightbox';
var LIGHTBOX_CLOSE_CLASSNAME = 'lightbox-close';
var LIGHTBOX_OVERLAY_CLASSNAME = 'lightbox-overlay';
var NEXT_CLASSNAME = 'next';
var PREV_CLASSNAME = 'prev';
var THUMBNAIL_SPIN_DELAY = 50;

function applyLoadedClassName(thumbnailImage) {
  thumbnailImage.className = LOADED_THUMBNAIL_IMAGE_CLASSNAME;
}

var View = function(opts) {
  this._searchForm = opts.searchForm;
  this._searchInput = opts.searchInput;
  this._thumbnailContentArea = opts.thumbnailContentArea;
  this._lightboxOverlay = opts.lightboxOverlay;
  this._lightboxImage = opts.lightboxImage;
  this._noResultsErrorMessage = opts.noResultsErrorMessage;
  this._spinner = opts.spinner;

  this.init();
};

View.prototype.init = function() {
  this._search = this._search.bind(this);
  this._openLightBox = this._openLightBox.bind(this);
  this._createThumbnailImage = this._createThumbnailImage.bind(this);
  this._handleLightboxClick = this._handleLightboxClick.bind(this);
};

View.prototype.bindCallbacks = function(callbacks) {
  this._fetchImages = callbacks.fetchImages;
  this._getLightboxImage = callbacks.getLightboxImage;

  this._searchForm.addEventListener('submit', this._search);
  this._lightboxOverlay.addEventListener('click', this._handleLightboxClick);
  this._thumbnailContentArea.addEventListener('click', this._openLightBox);
};

View.prototype.waitForImages = function() {
  this._thumbnailContentArea.innerHTML = '';
  this._thumbnailContentArea.appendChild(this._spinner);
};

View.prototype.renderThumbnails = function(thumbnailsData) {
  var content;
  if (thumbnailsData.length === 0) {
    content = this._noResultsErrorMessage;
  } else {
    content = document.createDocumentFragment();
    this._thumbnailImages = thumbnailsData.map(this._createThumbnailImage);
    this._thumbnailImages.forEach(content.appendChild.bind(content));
  }
  this._thumbnailContentArea.innerHTML = '';
  this._thumbnailContentArea.appendChild(content);
};

View.prototype.showLightboxForImage = function(lightboxImageData) {
  this._lightboxImageData = lightboxImageData;
  this._lightboxImage.src = lightboxImageData.link;

  if (!this._lightboxOpened) {
    document.body.appendChild(this._lightboxOverlay);
    this._lightboxOpened = true;
  }
};

View.prototype._search = function(event) {
  event.preventDefault();

  this._fetchImages(this._searchInput.value);
};

View.prototype._openLightBox = function(event) {
  if (event.target.className === LOADED_THUMBNAIL_IMAGE_CLASSNAME) {
    this._getLightboxImage(event.target.id);
  }
};

View.prototype._closeLightbox = function() {
  document.body.removeChild(this._lightboxOverlay);
  this._lightboxOpened = false;
};

View.prototype._createThumbnailImage = function(thumbnailData, index) {
  var image = document.createElement('img');
  var thumbnailImage = document.createElement('div');
  thumbnailImage.className = THUMBNAIL_IMAGE_CLASSNAME;
  thumbnailImage.id = thumbnailData.id;
  image.addEventListener('load', function() {
    setTimeout(applyLoadedClassName.bind(null, thumbnailImage), THUMBNAIL_SPIN_DELAY * index);
  });
  image.src = thumbnailData.link;
  thumbnailImage.style.backgroundImage = 'url("' + thumbnailData.link + '")';

  return thumbnailImage;
};

View.prototype._handleLightboxClick = function(event) {
  switch(event.target.className) {
  case LIGHTBOX_CLASSNAME:
    event.stopPropagation();
    break;
  case NEXT_CLASSNAME:
    event.stopPropagation();
    this._getLightboxImage(this._lightboxImageData.nextImageId);
    break;
  case PREV_CLASSNAME:
    event.stopPropagation();
    this._getLightboxImage(this._lightboxImageData.prevImageId);
    break;
  case LIGHTBOX_OVERLAY_CLASSNAME:
  case LIGHTBOX_CLOSE_CLASSNAME:
    this._closeLightbox();
    break;
  }
};

module.exports = View;
