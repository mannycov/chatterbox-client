
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'default',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: {}
};

app.init = function() {
  app.username = window.location.search.substring(10);

  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');

  app.$send.on('submit', app.handleSubmit);
  app.$roomSelect.on('change', app.handleRoomChange);
  app.$chats.on('click', '.username', app.handleUserNameClick);

  app.fetch();

  setInterval(function() {
    app.fetch();
  }, 3000);

};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {'order': '-createdAt'},
    contentType: 'application/JSON',
    success: function(data) {
      console.log('chatterbox: message fetched successfully');
      if (!data.results || !data.results.length) {
        return;
      } else {
        app.messages = data.results;
        app.clearMessages();

        var mostRecentMessage = app.messages[app.messages.length - 1];

        if (mostRecentMessage.objectId !== app.lastMessageId) {
          app.renderRoomList(app.messages);
          app.renderMessages(app.messages);
        }

      }
    },
    error: function(data) {
      console.error('chatterbox: failed to send message', data);
    },
  });
};

app.renderMessages = function(messages) {
  app.clearMessages();

  messages
    .filter(function(message) {
      if (app.roomname === 'lobby' && !message.roomname) {
        return true;
      } else if (message.roomname === app.roomname) {
        return true;
      } else {
        return false;
      }
    })
    .forEach(app.renderMessage);
};

app.renderMessage = function(message) {
  var $chat = $('<div class="chat"/>');

  var $username = $('<span class="username"/>');
  $username
    .text(message.username + ': ')
    .attr('data-username', message.username)
    .appendTo($chat);

  if (app.friends[message.username] === true) {
    $username.addClass('friend');
  }

  var $message = $('<br><span/>');
  $message.text(message.text).appendTo($chat);

  app.$chats.append($chat);

};

app.clearMessages = function() {
  app.$chats.html('');
};

app.handleSubmit = function(event) {

  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };

  app.send(message);

  console.log('success');
};

app.send = function(message) {

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',

    success: function(data) {

      app.$message.val('');
      app.fetch();
      console.log('chatterbox: Message sent', data);

    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.renderRoomList = function(messages) {
  app.$roomSelect.html('<option value="__newRoom">New room...</option></select>');

  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        app.renderRoom(roomname);

        rooms[roomname] = true;
      }
    });

  }
  app.$roomSelect.val(app.roomname);
};

app.renderRoom = function(roomname) {
  var $option = $('<option/>').val(roomname).text(roomname);

  app.$roomSelect.append($option);
};

app.handleRoomChange = function(event) {
  var selectIndex = app.$roomSelect.prop('selectedIndex');
  if (selectIndex === 0) {
    var roomname = prompt('Enter room name');

    if (roomname) {
      app.roomname = roomname;
      app.renderRoom(roomname);
      app.$roomSelect.val(roomname);
    }
  } else {
    app.roomname = app.$roomSelect.val(app.roomname);
  }
  app.renderMessages(app.messages);
};

app.handleUserNameClick = function(event) {
  var username = $(event.target).data('username');

  if (username !== undefined) {
    app.friends[username] = !app.friends[username];

    var selector = '[data-username="' + username.replace(/"/g, '\\\"' + '"]');
    var $usernames = $(selector).toggleClass('friend');
  }
};



