const DEBUG_MODE = false;

const START_DELAY = 5000;
const SLEEP_DELAY = 15000;
const DISABLE_EDIT_MODE_DELAY = 5000;
const NEXT_EFFECT_INDICATION_DURATION = 100;
const ADVERTISING_INTERVAL = 60;

var sleepSubscription = null;
var currentState = "idle";
var nextEffectSubscription = null;
var stopEditingSubscription = null;
var disableEditModeSubscription = null;
var pressCount = 0;

function resetSleepSubscription() {
  if (sleepSubscription != null) {
    clearTimeout(sleepSubscription);
    sleepSubscription = null;
  }
}

function delaySleep() {
  resetSleepSubscription();
  sleepSubscription = setTimeout(() => {
    sleep();
    sleepSubscription = null;
  }, SLEEP_DELAY);
}

function sleep() {
  if (!DEBUG_MODE) {
    NRF.sleep();
  }
  LED3.write(false);
  currentState = "sleep";
  console.log("! BLE Sleep");
}

function awake() {
  resetSleepSubscription();
  if (!DEBUG_MODE) {
    NRF.wake();
  }
  LED3.write(true);
  currentState = "idle";
  console.log("! BLE Awake");
}

function listenForClicksToStartEditing() {
  setWatch((e) => {
    enableEditMode();
  }, BTN, { edge: "rising", repeat: false, debounce: 50 });
}

function enableEditMode() {
  currentState = "editing";
  awake();
  console.log("> Edit mode: on");
  LED2.write(true);
  nextEffectSubscription = setWatch((e) => {
    nextEffect();
  }, BTN, { edge: "rising", repeat: true, debounce: 50 });
  delayDisableEditMode();
}

function nextEffect() {
  indicateNextEffect();
  resetStopEditingSubscription();
  delayDisableEditMode();
  console.log("> Next effect");
  if (!DEBUG_MODE) {
    NRF.setAdvertising({0xFFFF : [pressCount]}, {interval: ADVERTISING_INTERVAL});
  }
  pressCount++;
}

function indicateNextEffect() {
  LED1.write(true);
  setTimeout(() => {
    LED1.write(false);
  }, NEXT_EFFECT_INDICATION_DURATION);
}

function resetStopEditingSubscription() {
  if (stopEditingSubscription != null) {
    clearTimeout(stopEditingSubscription);
    stopEditingSubscription = null;
  }
}

function resetDisableEditModeSubscription() {
  if (disableEditModeSubscription != null) {
    clearTimeout(disableEditModeSubscription);
    disableEditModeSubscription = null;
  }
}

function delayDisableEditMode() {
  resetDisableEditModeSubscription();
  disableEditModeSubscription = setTimeout(() => {
    disableEditMode();
  }, DISABLE_EDIT_MODE_DELAY);
}

function disableEditMode() {
  console.log("> Edit mode: off");
  currentState = "idle";
  LED2.write(false);
  clearWatch(nextEffectSubscription);
  listenForClicksToStartEditing();
  delaySleep();
}

function main() {
  console.log("* HELLO WORLD *  -  DEBUG: " + DEBUG_MODE + " (if enabled, the device will not sleep or wake)");
  console.log("* Battery " + Puck.getBatteryPercentage() + " *");
  setTimeout(() => {
    if (!DEBUG_MODE) {
      NRF.sleep();
    }
    listenForClicksToStartEditing();
  }, START_DELAY);
}

main();