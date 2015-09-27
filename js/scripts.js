(function() {

  var root = 'https://todos-radugaspar.c9.io',
    lists = root + '/lists',
    client = new XMLHttpRequest(),
    processData = function(data) {
      console.log(data, JSON.parse(data.response));
    },
    handler = function() {
      if(this.readyState == this.DONE) {
        if(this.status == 200) {
          processData(this);
          return;
        }
        // something went wrong
        processData(null);
      }
    };

  // client.onreadystatechange = handler;
  // client.open("GET", lists);
  // client.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  // client.send();
  // client.open("POST", lists);
  // client.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  // client.send(JSON.stringify({name: 'Food'}));
}());

// basic helper function
function ajax(type, url, data, cb) {
  var xhr = new XMLHttpRequest(),
    handler = function() {
      if(this.readyState == this.DONE) {
        if(this.status == 200) {
          cb(this.response || this.responseText);
          return;
        }
        // something went wrong
        cb(null);
      }
    };

  xhr.onreadystatechange = handler;
  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(data);

  return xhr; // not a bad idea to also return the request object
}

// usage:
// ajax('GET', 'https://todos-radugaspar.c9.io/lists', null, function(data) {
//   console.log(data);
// });