var Botkit = require('botkit');
var builder = require('botbuilder');
var index = require('./dialogs/index');

var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: require('./config').slackBotToken
});

var slackBot = new builder.SlackBot(controller, bot);
slackBot.add('/', index);

slackBot.listenForMentions();

bot.startRTM(function(err,bot,payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
});