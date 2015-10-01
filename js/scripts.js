var todos = (function() {
  var root = 'https://todos-radugaspar.c9.io',
    lists = root + '/lists',
    complete = root + '/complete',

    // templates
    todoTmpl = document.querySelector('#todo-template').innerHTML,
    listTmpl = document.querySelector('#list-template').innerHTML,
    editListTmpl = document.querySelector('#edit-list-template').innerHTML,
    editTodoTmpl = document.querySelector('#edit-todo-template').innerHTML,
    completeTodoTmpl = document.querySelector('#complete-todo-template').innerHTML,

    // lists
    todoLists = document.querySelector('.todos-list'),
    todosList = document.querySelector('.incomplete-todos'),
    completeList = document.querySelector('.complete-todos'),

    // view manager
    vm = null,

    // store currently viewed list
    current = null,

    // private methods
    goBack = function() {
      vm.prev();
    },
    initViews = function() {
      vm = new viewMngr.ViewManager();
      var views = document.querySelectorAll('.view');
      for(var i=0; i<views.length; i++) {
        var view = new viewMngr.View(views[i]);
        vm.add(view);
      }
    },
    initEvents = function() {
      delegate('click', '.todos-list', 'li', function() {
        console.log('clicked', this, this.attributes['data-uid'].value);
        current = this.attributes['data-uid'].value;
        vm.next();
        populateTodos();
        populateComplete();
      });
    },
    init = function() {
      initViews();
      initEvents();
      populateTodoLists();
    },

    // todo lists CRUD
    createTodoList = function(e, input) {
      if(e.keyCode == 13) {
        // enter was pressed
        post(lists, { name: input.value.trim() }, function(data) {
          if(data.entry) {
            todoLists.innerHTML += createListElement(data.entry, true);
          }
        })
        console.log(e, input, input.value);
        input.value = "";
      }
    },
    editTodoList = function(btn, uid, name) {
      // swap node with input template
      var parent = btn.parentNode;
      console.log('edit', parent, uid);
      parent.innerHTML = editListTmpl
                          .replace(/{{name}}/, name)
                          .replace(/{{uid}}/, uid);

      // focus input and select all text in it
      var input = parent.querySelector('input');
      input.focus();
      if(input.setSelectionRange) {
        input.setSelectionRange(0, input.value.length);
      }
    },
    updateTodoList = function(e, input, uid) {
      if(e.keyCode == 13) {
        // enter was pressed
        var parent = input.parentNode;
        put(lists+'/'+uid, { name: input.value.trim() }, function(data) {
          if(data.entry) {
            // update parent innerHTML with new details
            parent.innerHTML = createListElement(data.entry);
          }
        });
      }
    },
    deleteTodoList = function(btn, uid) {
      var parent = btn.parentNode;
      del(lists+'/'+uid, function(data) {
        if(data.deleted) {
          parent.remove();
        }
      });
    },
    createListElement = function(obj, wrapped) {
      var entry = listTmpl
        .replace(/{{uid}}/g, obj.uid)
        .replace(/{{name}}/g, obj.name);

      if(wrapped) {
        return '<li class="list-group-item" data-uid="' + obj.uid + '">' + entry + '</li>'
      }
      
      return entry;
    },
    populateTodoLists = function() {
      var result = '';
      todoLists.innerHTML = '';
      get(lists, function(data) {
        console.log('my todo lists', data);
        if(Object.getOwnPropertyNames(data.lists).length) {
          for(var i in data.lists) {
            var el = data.lists[i];
            result = result.concat(createListElement(el, true));
          }
          todoLists.innerHTML = result;
        } else {
          // list is empty
          todoLists.innerHTML = 'There are no todo lists available; add some!';
        }
      })
    },

    // todos list CRUDS
    createTodo = function(e, input) {
      if(e.keyCode == 13) {
        // enter was pressed
        var url = lists+'/'+current+'/todos';
        post(url, { name: input.value.trim() }, function(data) {
          console.log('posted todo', data);
          if(data.entry) {
            todosList.innerHTML += createTodoElement(data.entry, true);
          }
        })
        console.log(e, input, input.value);
        input.value = "";
      }
    },
    populateTodos = function() {
      var result = '',
        url = lists+'/'+current+'/todos';
      todosList.innerHTML = '';
      get(url, function(data) {
        console.log('todos for list', current, data);
        if(Object.getOwnPropertyNames(data.todos).length) {
          for(var i in data.todos) {
            var el = data.todos[i];
            result = result.concat(createTodoElement(el, true));
          }
          todosList.innerHTML = result;
        } else {
          // list is empty
          todosList.innerHTML = 'There are no todos available; add some!';
        }
      })
    },
    createTodoElement = function(obj, wrapped) {
      var entry = todoTmpl
        .replace(/{{uid}}/g, obj.uid)
        .replace(/{{name}}/g, obj.name)
        .replace(/{{status}}/g, obj.status ? "checked" : "");

      if(wrapped) {
        return '<li class="list-group-item" data-uid="' + obj.uid + '">' + entry + '</li>'
      }
      
      return entry;
    },
    createCompleteElement = function(obj, wrapped) {
      var entry = completeTodoTmpl
        .replace(/{{name}}/g, obj.name);

      if(wrapped) {
        return '<li class="list-group-item" data-uid="' + obj.uid + '">' + entry + '</li>'
      }
      
      return entry;
    },
    editTodoElement = function(btn, uid, name) {
      // swap node with input template
      var parent = btn.parentNode;
      console.log('edit', parent, uid);
      parent.innerHTML = editTodoTmpl
                          .replace(/{{name}}/, name)
                          .replace(/{{uid}}/, uid);

      // focus input and select all text in it
      var input = parent.querySelector('input');
      input.focus();
      if(input.setSelectionRange) {
        input.setSelectionRange(0, input.value.length);
      }
    },
    updateTodoElement = function(e, input, uid) {
      if(e.keyCode == 13) {
        // enter was presse1d
        var parent = input.parentNode,
          url = lists+'/'+current+'/todos/'+uid;
        put(url, { name: input.value.trim() }, function(data) {
          if(data.entry) {
            // update parent innerHTML with new details
            parent.innerHTML = createTodoElement(data.entry);
            populateComplete();
          }
        });
      }
    },
    deleteTodoElement = function(btn, uid) {
      var parent = btn.parentNode,
        url = lists+'/'+current + '/todos/' + uid;
      del(url, function(data) {
        if(data.deleted) {
          parent.remove();
        }
      });
    },
    populateComplete = function() {
      get(complete, function(data) {
        console.log('complete list', current, data);
        if(Object.getOwnPropertyNames(data.complete).length) {
          var result = '';
          completeList.innerHTML = '';
          for(var i in data.complete) {
            var el = data.complete[i];
            result = result.concat(createCompleteElement(el, true));
          }
          completeList.innerHTML = result;
        } else {
          // list is empty
          completeList.innerHTML = 'There are no completed todos; get to it!';
        }
      })
    },
    todoChangeStatus = function(input, uid) {
      console.log('todoChangeStatus', input.checked, input, uid);
      var url = lists + '/' + current + '/todos/' + uid;
      put(url, { status: input.checked }, function(data) {
        console.log('status update', data);
        populateComplete();
      })
    };

  // expose public methods
  return {
    init: init,
    todoLists: {
      create: createTodoList,
      edit: editTodoList,
      update: updateTodoList,
      del: deleteTodoList
    },
    todo: {
      create: createTodo,
      edit: editTodoElement,
      update: updateTodoElement,
      del: deleteTodoElement
    },
    complete: {
      change: todoChangeStatus
    },
    goBack: goBack
  }
}());

todos.init();