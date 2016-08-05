'use strict';

var Controller = require('./controller');
var Model = require('./model');
var View = require('./view');

var App = function() {};

App.prototype.onDomReady = function() {
  var searchForm = document.getElementsByClassName('search-form')[0];
  var searchInput = document.getElementsByClassName('search-input')[0];

  var view = new View({
    searchForm: searchForm,
    searchInput: searchInput
  });

  var controller = new Controller({
    model: new Model(),
    view: view
  });

  controller.bindEvents();
};

var app = new App();
document.addEventListener('DOMContentLoaded', app.onDomReady);
