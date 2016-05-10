'use strict';

var builder = require('botbuilder');
var prompts = require('../prompts');
var config = require('../config');
const capWrd = require('../util').capitaliseWords;

/** Return a LuisDialog that points at our model and then add intent handlers. */
var model = process.env.model || config.luisToken;
var dialog = new builder.LuisDialog(model);
module.exports = dialog;

/** Answer users help requests. We can use a DialogAction to send a static message. */
dialog.on('Help', builder.DialogAction.send(prompts.helpMessage));

/** Prompts a user for the title of the task and saves it.  */
dialog.on('AddResult', [
	function (session, args, next) {
		// See if got the tasks title from our LUIS model.
		let p1 = builder.EntityRecognizer.findEntity(args.entities, 'player::p1');
		let p2 = builder.EntityRecognizer.findEntity(args.entities, 'player::p2');
		let s1 = builder.EntityRecognizer.findEntity(args.entities, 'score::s1');
		let s2 = builder.EntityRecognizer.findEntity(args.entities, 'score::s2');

		let result = session.dialogData.result = {
			p1: p1 ? p1.entity : null,
			p2: p2 ? p2.entity : null,
			s1: s1 ? s1.entity : null,
			s2: s2 ? s2.entity : null,
		};

		//ask for p1 if not provided
		if (!p1) {
			builder.Prompts.text(session, prompts.getFirstTeam);
		}
		else {
			next()
		}
	},
	function(session, results, next) {
		let result = session.dialogData.result;
		if (results.response) {
			result.p1 = results.response;
		}

		//ask for p2 if not provided
		if(result.p1 && !result.p2) {
			builder.Prompts.text(session,prompts.getSecondTeam);
		}
		else {
			next()
		}
	},
	function(session, results, next) {
		let result = session.dialogData.result;
		if (results.response) {
			result.p2 = results.response;
		}

		//ask for the score of team 1
		if(result.p1 && result.p2 && !result.s1) {
			builder.Prompts.number(session,'What did ' + capWrd(result.p1) + ' score?');
		}
		else {
			next()
		}
	},
	function(session, results, next) {
		let result = session.dialogData.result;
		if (results.response) {
			result.s1 = results.response;
		}

		//ask for p2 if not provided
		if(result.p1 && result.p2 && result.s1 && !result.s2) {
			builder.Prompts.number(session,'What did ' + capWrd(result.p2) + ' score?');
		}
		else {
			next()
		}
	},
	function(session, results) {
		let result = session.dialogData.result;
		if (results.response) {
			result.s2 = results.response;
		}

		if (result.p1 && result.p2 && result.s1 && result.s2){
			let res = result.p1 + " " + result.s1 +" - " + result.s2 + " " + result.p2;
			session.send(prompts.resultCreated, {result: res});
		} else {
            session.send(prompts.error);
        }
		session.endDialog();
	}
]);

/** Shows the user a list of tasks. */
dialog.on('ListResults', function (session) {
	if (session.userData.results && session.userData.results.length > 0) {
		let list = '';
		session.userData.results.forEach(function (value, index) {
			list += session.gettext(prompts.listResult, {result: value });
		});
		session.send(prompts.listResultsList, list);
	}
	else {
		session.send(prompts.listNoResult);
	}
});
