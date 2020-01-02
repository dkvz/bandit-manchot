// We're now putting everything in an object that'll
// be accessible globally.
// We still need to fetch some DOM elements too.
// We also put the constants in there now.
const app = {
  startMoney: 500,
  startBet: 20,
  imageHeight: 110,
  imageCount: 4,
  slotUpdateTime: 3,
  slots: document.querySelectorAll('.slots > div'),
  initialize: function() {
    this.state = {
      positions: [0, 0, 0],
      yPositions: [0, 0, 0],
      prevPositions: [0, 0, 0]
    };
    this.state.cash = this.startMoney;
    this.state.bet = this.startBet;
    this.updateUI();
  },
  updateUI: function () {
    this.cashLabel.textContent = `$ ${this.state.cash}`;
    this.betLabel.textContent = `$ ${this.state.bet}`;
  },
  updateSlots: function () {
    // Minimum rolling is at least one complete
    // revolution if we rolled 0 somewhere.
    this.state.positions.forEach((p, i) => {
      this.state.yPositions[i] += (this.imageCount * (i + 1) + p - this.state.prevPositions[i]) * this.imageHeight;
      this.slots[i].style.backgroundPositionY = -this.state.yPositions[i] + 'px';
    });
  },
  reset: function () {
    this.initialize();
    this.leverBtn.disabled = true;
    this.updateSlots();
    // Wait for 3 sec before re-enabling:
    setTimeout(
      () => this.leverBtn.disabled = false,
      this.slotUpdateTime * 1000
    );
    // Reset the status message:
    this.status.textContent = '';
  },
  checkWinState: function () {
    // For the moment just check if 
    // all equal.
    for (let i = 1; i < this.state.positions.length; i++) {
      if (this.state.positions[i] !== this.state.positions[0]) return false;
    }
    return true;
  },
  play: function () {
    // We can't roll the lever unless we got
    // enough cash to bet.
    if (this.state.cash >= this.state.bet) {
      this.state.cash -= this.state.bet;
      this.updateUI();
      // Run the slots, temporarily disable
      // the lever.
      // Reset the status message too.
      this.status.textContent = '';
      this.leverBtn.disabled = true;
      this.state.prevPositions = this.state.positions;
      this.state.positions = this.state.positions.map(
        () => Math.floor(Math.random() * this.imageCount)
      );
      this.updateSlots();
      // Slots will take 3 seconds to update.
      // We have to wait before checking win or lose
      // status.
      setTimeout(() => {
        // Check winning conditions:
        if (this.checkWinState()) {
          const won = this.state.bet * 7;
          this.state.cash += won;
          this.status.textContent = `Gagné $ ${won} !`;
          this.updateUI();
        } else {
          this.status.textContent = 'Perdu !';
        }
        this.leverBtn.disabled = false;
      }, this.slotUpdateTime * 1000);
    } else {
      alert('Plus assez de cash!');
    }
  },
  betAdd: function() {
    this.state.bet += 5;
    this.updateUI();
  },
  betRemove: function() {
    if (this.state.bet === 5) {
      alert('Impossible de miser moins.');
    } else {
      this.state.bet -= 5;
    }
    this.updateUI();
  }
};

[
  'leverBtn',
  'cashLabel',
  'betLabel',
  'status'
]
.forEach(e => app[e] = document.getElementById(e));

// Initialize:
app.initialize();

// Make sure it's available globally
// We only have to do this because I'm
// using a module bundler (Parcel).
window.app = app;

// Create the event handler functions:

window.resetClick = app.reset.bind(app);

window.leverClick = app.play.bind(app);

window.addBetClick = app.betAdd.bind(app);

window.betRemoveClick = app.betRemove.bind(app);