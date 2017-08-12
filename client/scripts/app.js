
// *"appId":*  "72b8e073a4abde10221ce95f38ed1c63bd7f3d6b",
//*"restAPIKey":* "cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a"

var app = {

  init: function() {

  },

  send: function() {
    $.ajax({

      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      dataType: 'jsonp',
      success: function (data) {
        return data.text;
        console.log('chatterbox: Message sent');
      },

      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }


    });

  },

  fetch: function() {
    $.ajax({

      url: undefined,
      type: 'GET',
      dataType: 'jsonp',


    });

  }



};



