const cBlack = 'color:#252423;'
const cWhite = 'color:#FFF;'
const cRed = 'color:#FF4B4B;'
const bgRed = cBlack+'background-color:#FF4B4B;'
const cGreen = 'color:#18FF74;'
const bgGreen = cBlack+'background-color:#18FF74;'

function log(testName, expected, received, isPassing) {
  if (!isPassing) {
    console.log('%c FAIL ' + '%c ' + testName, bgRed, cRed);
    console.log('%c✓ ' + '%cExpected: ' + '%c' + expected, cGreen, cWhite, cGreen);
    console.log('%c✕ ' + '%cReceived: ' + '%c' + received, cRed, cWhite, cRed);
  } else {
    console.log('%c SUCCESS ' + '%c ' + testName, bgGreen, cWhite);
  }
}

export function test(testName, testFunc) {
  try {
    const { expected, received, isPassing } = testFunc();
    log(testName, expected, received, isPassing);
  } catch(e) {
    console.log('%c TEST ERROR ' + '%c ' + testName, bgRed, cRed);
    return console.log(e);
  }
}

export function expect(value) {
  return {
    toBe: (expected) => {
      return {
        expected,
        received: value,
        isPassing: value === expected
      }
    },
    toBeSuperiorTo: (expected) => {
      return {
        expected,
        received: value,
        isPassing: value > expected
      }
    }
  }
}
