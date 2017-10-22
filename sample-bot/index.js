const request = require('request');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/webhook', function(req, res){
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "ProgrammerGirlVeryComplicatedToken") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if(messageText.toLowerCase()=='witaj'){
    var responseText = 'Witaj! 🎲\nNapisz, czego chcesz się dowiedzieć. Masz kilka opcji:\n- programowanie ♠\n- gry planszowe ♥\n- wydarzenia ♣\n- papa ♦\nWybór należy do Ciebie 🎴';
	echo(senderID, responseText);
  }
  else if(messageText.toLowerCase()=='programowanie'){
    sendProgrammerGirlProgrammingMessage(senderID);
  } 
  else if (messageText.toLowerCase()=='wydarzenia'){
	  sendProgrammerGirlEventsMessage(senderID);
  }
  else if (messageText.toLowerCase()=='gry planszowe') {
	  sendProgrammerGirlCustomMessage(senderID);
  }
  else if (messageText.toLowerCase()=='papa') {
	  var byeText = "Było mi bardzo miło. Papa 👋";
	  echo(senderID, byeText);
  }
  // else {
    // echo(senderID, messageText + ' :)');
  // }
}

function echo(recipientId, messageText){
  // Construct reply message
  var echo = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(echo);
}


function sendStructuredMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "programmer-girl blog",
            subtitle: "Najlepszy blog dotyczący programowania i gier planszowych",
            item_url: "https://programmer-girl.com",
            image_url: "https://programmergirlsite.files.wordpress.com/2017/10/cropped-file4051235567641.jpg",
            buttons: [{
              type: "web_url",
              url: "https://programmer-girl.com",
              title: "Otwórz"
            }, {
              type: "postback",
              title: "Call Postback One", // button text
              payload: "Payload for first bubble", // postback body
            }],
          }, {
            title: "DevCamp",
            subtitle: "The best IT event",
            item_url: "http://devcamp.pl/",
            image_url: "https://d1ll4kxfi4ofbm.cloudfront.net/images/621921/3af0f2b904c54475f17a7919b166e900.png",
            buttons: [{
              type: "web_url",
              url: "http://devcamp.pl/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback Two",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendProgrammerGirlCustomMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Zagadki planszówkowe",
            subtitle: "Lista dotychczasowych zagadek planszówkowych",
            item_url: "https://programmer-girl.com/category/zagadki-planszowkowe/",
            image_url: "https://programmergirlsite.files.wordpress.com/2017/07/9379813470_169ddf2ccf_z.jpg",
            buttons: [{
              type: "web_url",
              url: "https://programmer-girl.com/category/zagadki-planszowkowe/",
              title: "Zobacz zagadki"
            },],
          }, {
            title: "Aplikacja BoardGamesNook",
            subtitle: "Aplikacja dla fanów gier planszowych",
            item_url: "https://programmer-girl.com/category/boardgamesnook/",
            image_url: "https://programmergirlsite.files.wordpress.com/2017/10/cropped-file4051235567641.jpg",
            buttons: [{
              type: "web_url",
              url: "https://programmer-girl.com/category/boardgamesnook/",
              title: "Zobacz posty"
            }, {
              type: "web_url",
              url: "https://boardgamesnook.azurewebsites.net/",
              title: "Zobacz aplikację"
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendProgrammerGirlProgrammingMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Programowanie - C# i Angular",
            subtitle: "Lista postów dotyczących programowania w C#",
            item_url: "https://programmer-girl.com/category/c/",
            image_url: "https://programmergirlsite.files.wordpress.com/2017/05/4310529876_1971b7b009_z.jpg",
            buttons: [{
              type: "web_url",
              url: "https://programmer-girl.com/category/c/",
              title: "C# - zobacz posty"
            }, {
              type: "web_url",
              url: "https://programmer-girl.com/category/angular/",
              title: "Angular - zobacz posty"
            }],
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendProgrammerGirlEventsMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Wydarzenia",
            subtitle: "Lista postów dotyczących wydarzeń programistycznych i nie tylko",
            item_url: "https://programmer-girl.com/category/wydarzenia/",
            image_url: "https://programmergirlsite.files.wordpress.com/2017/06/19672369969_63f6b14dd9_z.jpg",
            buttons: [{
              type: "web_url",
              url: "https://programmer-girl.com/category/wydarzenia/",
              title: "Wydarzenia - zobacz posty"
            }],
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAFDuEWkww0BAOjG70ZCzoqVy9sWEPe3kzZARzTzRj1TBZCxLoa6ojtiCvitYbsDMC2J3x5dQLQ1h1DCp7Lr1mS0ZBqK4mQRuOXlUrqclDiCULC4GpxwyboJBl2wDfFhCdudyGDOlP3jLWp6Op4hZBoHHmq2AWp66XFpNjhX6iQZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
