(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Controller = require('./controller');
var Model = require('./model');
var View = require('./view');

var App = function() {};

App.prototype.onDomReady = function() {
  var controller = new Controller({
    model: new Model(),
    view: new View()
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
},{}],3:[function(require,module,exports){
'use strict';

var Model = function(opts) {
}

module.exports = Model;
},{}],4:[function(require,module,exports){
'use strict';

var View = function(opts) {
};

View.prototype.bind = function(callbacks) {
  this._fetchImages = callbacks.fetchImages;
  this._getLightboxImage = callbacks.getLightboxImage;
};

module.exports = View;
},{}]},{},[1]);
