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
