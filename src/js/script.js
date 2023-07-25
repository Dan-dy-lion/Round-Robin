const participants = [];

function generateRoundRobinBracket(participants, numRounds) {
  const numParticipants = participants.length;
  const rounds = numRounds || numParticipants - 1; // If numRounds is not provided, default to (numParticipants - 1)
  const bracket = [];

  // Helper function to rotate the array elements
  function rotateArray(arr) {
    arr.push(arr.shift());
  }

  for (let round = 0; round < rounds; round++) {
    const roundMatches = [];

    // Generate matches for this round
    for (let i = 0; i < numParticipants / 2; i++) {
      const match = [participants[i], participants[numParticipants - 1 - i]];
      roundMatches.push(match);
    }

    bracket.push(roundMatches);

    // Rotate the array for the next round
    rotateArray(participants);
  }

  return bracket;
}

function displayBracket(bracket, participants) {
  const roundsContainer = document.getElementById('rounds-container');
  const overallScoresContainer = document.getElementById('overall-scores');
  const participantScores = {};

  // Initialize participant scores to 0 for all participants
  participants.forEach((participant) => {
    participantScores[participant] = 0;
  });

  bracket.forEach((round, roundIndex) => {
    const roundElement = document.createElement('div');
    roundElement.classList.add('round');

    round.forEach((match) => {
      const matchElement = document.createElement('div');
      matchElement.classList.add('match');

      const matchText = document.createTextNode(`${match[0]} vs ${match[1]}`);
      matchElement.appendChild(matchText);

      const scoreElement = document.createElement('div');
      scoreElement.classList.add('match-score');
      scoreElement.innerHTML = `<input type="number" class="score" value="0"> - <input type="number" class="score" value="0">`;
      matchElement.appendChild(scoreElement);

      // Event listener to update winners when scores change
      matchElement.addEventListener('input', function (event) {
        updateMatchWinner(matchElement);

        // Update overall scores when match scores change
        updateOverallScores();
      });

      roundElement.appendChild(matchElement);
    });

    roundsContainer.appendChild(roundElement);
  });
}

function updateMatchWinner(matchElement) {
  const scoreElements = matchElement.querySelectorAll('.score');

  matchElement.classList.remove('winner', 'draw', 'loss');

  const score1 = parseInt(scoreElements[0].value, 10);
  const score2 = parseInt(scoreElements[1].value, 10);

  if (score1 > score2) {
    matchElement.classList.add('winner');
  } else if (score1 < score2) {
    matchElement.classList.add('loss');
  } else {
    matchElement.classList.add('draw');
  }
}

function startTournament() {
  const participantNamesInput = document.getElementById('participant-names');
  const numRoundsInput = document.getElementById('num-rounds');
  const roundsContainer = document.getElementById('rounds-container');
  const overallScoresContainer = document.getElementById('overall-scores');

  // Clear existing rounds and overall scores
  roundsContainer.innerHTML = '';
  overallScoresContainer.innerHTML = '';

  participants.length = 0; // Clear existing participants array
  participants.push(...participantNamesInput.value.split(',').map(name => name.trim()));

  const numRounds = parseInt(numRoundsInput.value, 10);
  const bracket = generateRoundRobinBracket(participants, numRounds);
  displayBracket(bracket, participants);
}

// Add event listener to the "Start Tournament" button
const startTournamentButton = document.getElementById('start-tournament-btn');
startTournamentButton.addEventListener('click', startTournament);
