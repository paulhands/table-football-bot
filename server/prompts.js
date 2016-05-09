// list of messages that can be sent back to the user.

module.exports = {
  helpMessage: "Here's what I can do:\n\n" +
  "* Add new results by saying something like 'England beat Germany 10 - 0'\n" +
  "* List the previous results by saying something like 'what where the last results?'\n",
  error: 'D\'oh, something went wrong, try again.',
  resultCreated: "Added a new result: '%(result)s'",
  playerMissing: 'I\'ve got %{player} scored %{s1}, who scored %{s2}?',
  scoreMissing: 'What was the score?',
  listResultsList: 'Results\n%s',
  listResult: '%(result)s\n',
  listNoResult: 'You have no tasks.',
  notEnoughData: 'Sorry, I didn\'t get that, please post results in the form \"Team A beat Team B 10-x\"',
  thanks: 'Cheers %{user}'
}
