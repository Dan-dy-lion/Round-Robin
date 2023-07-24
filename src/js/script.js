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

  // Initialize participant scores
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
      scoreElement.innerHTML = `<input type="number" class="score" min="0" max="100" value="0"> - <input type="number" class="score" min="0" max="100" value="0">`;
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

  // Display initial overall scores
  updateOverallScores();

  function updateOverallScores() {
    // Reset participant scores before recalculating
    participants.forEach((participant) => {
      participantScores[participant] = 0;
    });

    // Calculate and update participant scores based on match scores
    const matches = document.querySelectorAll('.match');
    matches.forEach((matchElement) => {
      const [score1, score2] = getMatchScores(matchElement);
      const participant1 = matchElement.textContent.split(' vs ')[0].trim();
      const participant2 = matchElement.textContent.split(' vs ')[1].trim();
      if (score1 > score2) {
        participantScores[participant1]++;
      } else if (score1 < score2) {
        participantScores[participant2]++;
      }
    });

    // Update overall scores in the DOM
    overallScoresContainer.innerHTML = '';
    participants.forEach((participant) => {
      const scoreElement = document.createElement('div');
      scoreElement.classList.add('participant-score');
      scoreElement.textContent = `${participant}: ${participantScores[participant]} points`;
      overallScoresContainer.appendChild(scoreElement);
    });
  }

  function getMatchScores(matchElement) {
    const scores = matchElement.querySelectorAll('.score');
    const score1 = parseInt(scores[0].value, 10);
    const score2 = parseInt(scores[1].value, 10);
    return [score1, score2];
  }

  function updateMatchWinner(matchElement) {
    const [score1, score2] = getMatchScores(matchElement);
    const scoreElements = matchElement.querySelectorAll('.score');

    if (score1 > score2) {
      matchElement.classList.add('winner');
      scoreElements[0].classList.add('winner-score');
      scoreElements[1].classList.remove('winner-score');
    } else if (score1 < score2) {
      matchElement.classList.remove('winner');
      scoreElements[0].classList.remove('winner-score');
      scoreElements[1].classList.add('winner-score');
    } else {
      matchElement.classList.remove('winner');
      scoreElements[0].classList.remove('winner-score');
      scoreElements[1].classList.remove('winner-score');
    }
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

  const participantNames = participantNamesInput.value.split(',').map(name => name.trim());
  const numRounds = parseInt(numRoundsInput.value, 10);

  const bracket = generateRoundRobinBracket(participantNames, numRounds);
  displayBracket(bracket, participantNames);
}

// Add event listener to the "Start Tournament" button
const startTournamentButton = document.getElementById('start-tournament-btn');
startTournamentButton.addEventListener('click', startTournament);
