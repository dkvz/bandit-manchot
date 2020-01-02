
// Some function definitions because 
// why not.
function resetState() {
  return {
    cash: startMoney,
    bet: startBet,
    positions: [0, 0, 0],
    yPositions: [0, 0, 0],
    prevPositions: [0, 0, 0]
  };
}

// All the params here are not technically
// necessary because of the magic of closure.
// Let's not get into that subject this time.

function updateUI(state, cashLabel, betLabel) {
  cashLabel.textContent = `$ ${state.cash}`;
  betLabel.textContent = `$ ${state.bet}`;
}

function updateSlots(state, slots, imageHeight, imageCount) {
  // Minimum rolling is at least one complete
  // revolution if we rolled 0 somewhere.
  state.positions.forEach((p, i) => {
    state.yPositions[i] += (imageCount * (i + 1) + p - state.prevPositions[i]) * imageHeight;
    slots[i].style.backgroundPositionY = -state.yPositions[i] + 'px';
  });
}

function checkWinState(state) {
  // For the moment just check if 
  // all equal.
  for (let i = 1; i < state.positions.length; i++) {
    if (state.positions[i] !== state.positions[0]) return false;
  }
  return true;
}

// Get all elements from DOM:
const [
  leverBtn,
  cashLabel,
  betLabel,
  betAddBtn,
  betRemoveBtn,
  resetBtn,
  status
] = [
  'leverBtn',
  'cashLabel',
  'betLabel',
  'betAddBtn',
  'betRemoveBtn',
  'resetBtn',
  'status'
].map(x => document.getElementById(x));

// Get all the slot elements from the DOM:
const slots = document.querySelectorAll('.slots > div');

// Define a few constants, such as the
// start money, bet and the image height
// for the scrolling background we use
// for the slots.
const startMoney = 500,
  startBet = 20,
  imageHeight = 110,
  imageCount = 4,
  slotUpdateTime = 3;

// Object to hold state variables for 
// the app. with a very inspired name.
let state = resetState();

// Update UI for the first time:
updateUI(state, cashLabel, betLabel);

// Bind events to UI elements:
leverBtn.addEventListener('click', () => {
  // We can't roll the lever unless we got
  // enough cash to bet.
  if (state.cash >= state.bet) {
    state.cash -= state.bet;
    updateUI(state, cashLabel, betLabel);
    // Run the slots, temporarily disable
    // the lever.
    // Reset the status message too.
    status.textContent = '';
    leverBtn.disabled = true;
    state.prevPositions = state.positions;
    state.positions = state.positions.map(
      () => Math.floor(Math.random() * imageCount)
    );
    updateSlots(state, slots, imageHeight, imageCount);
    // Slots will take 3 seconds to update.
    // We have to wait before checking win or lose
    // status.
    setTimeout(() => {
      // Check winning conditions:
      if (checkWinState(state)) {
        const won = state.bet * 7;
        state.cash += won;
        status.textContent = `Gagné $ ${won} !`;
        updateUI(state, cashLabel, betLabel);
      } else {
        status.textContent = 'Perdu !';
      }
      leverBtn.disabled = false;
    }, slotUpdateTime * 1000);
  } else {
    alert('Plus assez de cash!');
  }
});

resetBtn.addEventListener('click', () => {
  state = resetState();
  updateUI(state, cashLabel, betLabel);
  // Also reset the slots:
  updateSlots(state, slots, imageHeight, imageCount);
  leverBtn.disabled = true;
  // Wait for 3 sec before re-enabling:
  setTimeout(
    () => leverBtn.disabled = false, 
    slotUpdateTime * 1000
  );
  // Reset the status message:
  status.textContent = '';
});


betAddBtn.addEventListener('click', () => {
  state.bet += 5;
  updateUI(state, cashLabel, betLabel);
});

betRemoveBtn.addEventListener('click', () => {
  if (state.bet === 5) {
    alert('Impossible de miser moins.');
  } else {
    state.bet -= 5;
  }
  updateUI(state, cashLabel, betLabel);
});