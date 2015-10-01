var viewMngr = {};

viewMngr.ViewManager = function() {
  var views = [],
    current = null,
    setCurrent = function(view) {
      doReset();
      current = view;
      current.render();
      current.el.classList.add('current');
    },
    doReset = function() {
      var i = 0,
        viewsLen = views.length,
        el;
      for(i; i<viewsLen; i++) {
        el = views[i].el;
        el.classList.remove('current');
      }
    }

  return {
    add: function(view) {
      if(view instanceof viewMngr.View) {
        views.push(view);
        if(!current) {
          setCurrent(view);
        }
      }
    },
    next: function() {
      var idx = views.indexOf(current);
      idx = idx+1 > views.length-1 ? 0 : idx+1;
      setCurrent(views[idx]);
    },
    prev: function() {
      var idx = views.indexOf(current);
      idx = idx-1 < 0 ? views.length-1 : idx-1;
      setCurrent(views[idx]);
    }
  }
}
viewMngr.View = function(el) {
  this.el = el;
  this.render = function() {
    console.log("rendering", this.el);
  }
};