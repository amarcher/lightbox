(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./controller":2,"./model":3,"./view":5}],2:[function(require,module,exports){
'use strict';

var ajax = require('./utils/ajax');

var IMGUR_CLIENT_ID = 'f086e2b1e531860';
var IMGUR_SEARCH_URI = 'https://api.imgur.com/3/gallery/search/top/'

var Controller = function(opts) {
  this.view = opts.view;
  this.model = opts.model;

  this.init();
};

Controller.prototype.init = function() {
  this.fetchImages = this.fetchImages.bind(this);
  this.getLightboxImage = this.getLightboxImage.bind(this);
  this._handleImages = this._handleImages.bind(this);
  this._handleError = this._handleError.bind(this);
};

Controller.prototype.bindEvents = function() {
  this.view.bindCallbacks({
    fetchImages: this.fetchImages,
    getLightboxImage: this.getLightboxImage
  });
};

Controller.prototype.fetchImages = function(keyword) {
  this.view.waitForImages();
  this.model.empty();

  return ajax.get(IMGUR_SEARCH_URI, {
    q: 'title: ' + keyword
  }, {
    Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
  }).then(this._handleImages)
    .catch(this._handleError);
};

Controller.prototype.getLightboxImage = function(imageId) {
  return this.model.getLightboxImageData(imageId).then(function(lightboxImageData) {
    this.view.showLightboxForImage(lightboxImageData);
  }.bind(this));
};

Controller.prototype._handleImages = function(imageData) {
  this.model.populate(imageData);
  return this.model.getThumbnailsData()
    .then(function(thumbnailsData) {
      this.view.renderThumbnails(thumbnailsData);
    }.bind(this));
};

Controller.prototype._handleError = function(err) {
  console.log(err);
};

module.exports = Controller;

},{"./utils/ajax":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

require('whatwg-fetch');

function stringify(params) {
  return Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
}

var Ajax = {
  get(url, params, headers) {
    return fetch(url + '?' + stringify(params), {
      headers: headers
    }).then(function(resp) {
      return resp.json();
    });
  }
};

module.exports = Ajax;

},{"whatwg-fetch":6}],5:[function(require,module,exports){
'use strict';

var THUMBNAIL_IMAGE_CLASSNAME = 'thumbnail-image';
var LOADED_THUMBNAIL_IMAGE_CLASSNAME = 'thumbnail-image loaded';
var LIGHTBOX_CLASSNAME = 'lightbox';
var LIGHTBOX_CLOSE_CLASSNAME = 'lightbox-close';
var LIGHTBOX_OVERLAY_CLASSNAME = 'lightbox-overlay';
var NEXT_CLASSNAME = 'next';
var PREV_CLASSNAME = 'prev';
var THUMBNAIL_SPIN_DELAY = 50;

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
    this._thumbnailImages = thumbnailsData.map(this._createThumbnailImage)
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
  var image = new Image();
  image.src = thumbnailData.link;
  var thumbnailImage = document.createElement('div');
  thumbnailImage.className = THUMBNAIL_IMAGE_CLASSNAME;
  thumbnailImage.style.backgroundImage = 'url("' + thumbnailData.link + '")';
  thumbnailImage.id = thumbnailData.id;
  image.onload = function() {
    setTimeout(function() {
      thumbnailImage.className = LOADED_THUMBNAIL_IMAGE_CLASSNAME;
    }, THUMBNAIL_SPIN_DELAY * index);
  };

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

},{}],6:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[1]);
