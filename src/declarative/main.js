// Define a few constants, such as the
// start money, bet and the image height
// for the scrolling background we use
// for the slots.
const startMoney = 500,
  startBet = 20,
  imageHeight = 110,
  imageCount = 4,
  slotUpdateTime = 3;

// We still need to fetch some DOM elements:
// Get all elements from DOM:
const [
  leverBtn,
  cashLabel,
  betLabel,
  status
] = [
  'leverBtn',
  'cashLabel',
  'betLabel',
  'status'
].map(x => document.getElementById(x));

// Get all the slot elements from the DOM:
const slots = document.querySelectorAll('.slots > div');

// We're now putting everything in an object that'll
// be accessible globally.
const app = {
  state: {
    cash: startMoney,
    bet: startBet,
    positions: [0, 0, 0],
    yPositions: [0, 0, 0],
    prevPositions: [0, 0, 0]
  },
  
};

// Make sure it's available globally
// We only have to do this because I'm
// using a module bundler (Parcel).
window.app = app;