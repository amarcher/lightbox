'use strict';

require('whatwg-fetch');

function stringify(params) {
  return Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
}

var Ajax = {
  get: function(url, params, headers) {
    return fetch(url + '?' + stringify(params), {
      headers: headers
    }).then(function(resp) {
      return resp.json();
    });
  }
};

module.exports = Ajax;
