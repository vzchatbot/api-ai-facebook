var Botkit = require('botkit');
var controller = Botkit.facebookbot({
        access_token: 'EAAOFPm9yeWcBAOxdikvPx09cRjdbSgxhgwsjTGTmU1KSDUgOoh2eOuACWUYdjOQZBn0WzQ8FeqtNdm6k9VZBIRPvNE8r5MSKbHSbn8hg0fJhBc8dk33NgG5DZCC4229C1qdghz7B0cRZArR8JnNJE96g1CtKbScp5JNzwFx1hwZDZD',
        verify_token: 'CAA30DE7-CC67-4CBA-AF93-2B1C5C4C19D4',
})

var bot = controller.spawn({
});

// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(process.env.PORT || 3000,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function() {
      console.log('This bot is online!!!');
  });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function(bot, message) {

    bot.reply(message, 'Welcome to my app!');

});

// user said hello
controller.hears(['hello'], 'message_received', function(bot, message) {

    bot.reply(message, 'Hey there.');

});

controller.hears(['cookies'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});
