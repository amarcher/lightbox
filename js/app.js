'use strict';

var Controller = require('./controller');
var Model = require('./model');
var View = require('./view');

var App = function() {};

App.prototype.onDomReady = function() {
  var searchForm = document.getElementsByClassName('search-form')[0];
  var searchInput = document.getElementsByClassName('search-input')[0];
  var thumbnailContentArea = document.getElementsByClassName('thumbnail-content-area')[0];
  var lightboxOverlay = this.getElementFromTemplate('lightbox-overlay', 'lightbox-template');
  var lightboxImage = lightboxOverlay.getElementsByClassName('lightbox-image')[0];
  var noResultsErrorMessage = this.getElementFromTemplate('no-results-error', 'content-template');
  var spinner = this.getElementFromTemplate('spinner', 'content-template');

  var view = new View({
    searchForm: searchForm,
    searchInput: searchInput,
    thumbnailContentArea: thumbnailContentArea,
    lightboxOverlay: lightboxOverlay,
    lightboxImage: lightboxImage,
    noResultsErrorMessage: noResultsErrorMessage,
    spinner: spinner
  });

  var controller = new Controller({
    model: new Model(),
    view: view
  });

  controller.bindEvents();
};

App.prototype.getElementFromTemplate = function(elementClassName, templateClassName) {
  var lightboxTemplate = document.getElementsByClassName(templateClassName)[0];
  var container = document.createElement('div');
  container.innerHTML = lightboxTemplate.innerHTML;
  return container.getElementsByClassName(elementClassName)[0];
};

var app = new App();
document.addEventListener('DOMContentLoaded', app.onDomReady.bind(app));

module.exports = App;
