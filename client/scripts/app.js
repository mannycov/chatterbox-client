
// *"appId":*  "72b8e073a4abde10221ce95f38ed1c63bd7f3d6b",
//*"restAPIKey":* "cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a"

var app = {

  init: function() {

  },

  send: function() {
    $.ajax({

      url: 'http://parse.SFM.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      dataType: 'jsonp',
      success: function(messageObj) {
        return messageObj.username + ': ' + messageObj.text;
      }

    });

  },



};



