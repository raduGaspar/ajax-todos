var
  // basic method for binding events
  delegate = function(evt, parent, elm, cb) {
    [].forEach.call(document.querySelectorAll(parent), function(el) {
      el.addEventListener(evt, function(e) {
        // e.target was the clicked element
        if(e.target && e.target.nodeName == elm.toUpperCase()) {
          cb.call(e.target, e);
        }
      });
    });
  },

  // basic helper function
  ajax = function(type, url, data, cb) {
    var xhr = new XMLHttpRequest(),
      handler = function() {
        if(this.readyState == this.DONE) {
          if(this.status == 200) {
            try {
              var res = JSON.parse(this.response || this.responseText);
              cb(res);
            } catch(err) {
              console.log('cached error', err);
              cb(this.response || this.responseText);
            }
            return;
          }
          // something went wrong
          cb(null);
        }
      };

    xhr.onreadystatechange = handler;
    xhr.open(type, url);
    if(data) {
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }

    return xhr; // not a bad idea to also return the request object
  },
  get = function(url, cb) {
    return ajax('GET', url, null, cb);
  },
  post = function(url, data, cb) {
    return ajax('POST', url, data, cb);
  },
  put = function(url, data, cb) {
    return ajax('PUT', url, data, cb);
  },
  del = function(url, cb) {
    return ajax('DELETE', url, null, cb);
  };