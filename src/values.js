import {
  emptyString,
  unitsExecRgx,
} from './consts.js';

import {
  is,
  stringContains,
  arrayContains,
} from './helpers.js';

import {
  convertPxToUnit,
  getTransformUnit,
  splitValueUnit,
} from './units.js';

import {
  getTransformValue,
} from './transforms.js';

import {
  getAnimatables,
} from './animatables.js';

import {
  lowerCaseRgx,
  lowerCaseRgxParam,
  transformsExecRgx,
  relativeValuesExecRgx,
  // whiteSpaceTestRgx,
  digitWithExponentRgx,
  validTransforms,
  animationTypes,
  valueTypes,
  rgbaStrings,
} from './consts.js';

import {
  convertColorStringValuesToRgbaArray
} from './colors.js';

export function getFunctionValue(functionValue, animatable) {
  if (!is.fnc(functionValue)) return functionValue;
  return functionValue(animatable.target, animatable.id, animatable.total) || 0; // Fallback to 0 if the function results in undefined / NaN / null
}

function getCSSValue(el, prop, unit) {
  const uppercasePropName = prop.replace(lowerCaseRgx, lowerCaseRgxParam).toLowerCase();
  const value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
  return unit ? convertPxToUnit(el, value, unit) : value;
}

export function getAnimationType(el, prop) {
  if (is.obj(el)) {
    return animationTypes.OBJECT;
  } else if (is.dom(el)) {
    if (!is.nil(el.getAttribute(prop))) return animationTypes.ATTRIBUTE; // Handle DOM and SVG attributes
    if (arrayContains(validTransforms, prop)) return animationTypes.TRANSFORM; // Handle CSS Transform properties differently than CSS to allow individual animations
    if (prop in el.style) return animationTypes.CSS; // All other CSS properties
    if (!is.und(el[prop])) return animationTypes.OBJECT; // Handle DOM elements properies that can't be accessed using getAttribute()
    return console.warn(`Can't animate property '${prop}' on DOM element '${el}'.`);
  }
  return console.warn(`Target '${el}' can't be animated.`);
}

export function getOriginalAnimatableValue(animatable, propName, animationType) {
  const target = animatable.target;
  const animType = is.num(animationType) ? animationType : getAnimationType(target, propName);
  switch (animType) {
    case animationTypes.OBJECT: return target[propName] || 0; // Fallaback to 0 if the property doesn't exist on the object.
    case animationTypes.ATTRIBUTE: return target.getAttribute(propName);
    case animationTypes.TRANSFORM: return getTransformValue(animatable, propName);
    case animationTypes.CSS: return getCSSValue(target, propName);
  }
}

export function getRelativeValue(from, to) {
  const operator = relativeValuesExecRgx.exec(to);
  if (!operator) return to;
  const t = to.replace(operator[0], emptyString);
  const u = splitValueUnit(t)[3] || 0;
  const x = parseFloat(from);
  const y = parseFloat(t);
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function replaceValueUnitIfNecessary(val, unit) {
  if (!unit) {
    return val;
  } else {
    const originalSplitValueUnit = splitValueUnit(val);
    if (!is.und(originalSplitValueUnit[1])) {
      return originalSplitValueUnit[1] + unit;
    } else {
      return val;
    }
  }
}

export function getComputedValue(val) {
  const computed = {
    type: valueTypes.NUMBER,
  };
  const numberedVal = +val;
  if (!isNaN(numberedVal)) {
    computed.number = numberedVal;
    return computed;
  } else {
    const unitMatch = unitsExecRgx.exec(val);
    if (unitMatch) {
      computed.type = valueTypes.UNIT;
      computed.number = +unitMatch[2];
      computed.unit = unitMatch[3];
      return computed;
    } else if (is.col(val)) {
      computed.type = valueTypes.COLOR;
      computed.numbers = convertColorStringValuesToRgbaArray(val);
      computed.strings = rgbaStrings;
      return computed;
    } else {
      const stringifiedVal = val + emptyString;
      const matchedNumbers = stringifiedVal.match(digitWithExponentRgx);
      computed.type = valueTypes.COMPLEX;
      computed.numbers = matchedNumbers ? matchedNumbers.map(Number) : [0];
      computed.strings = stringifiedVal.split(digitWithExponentRgx) || [];
      return computed;
    }
  }
}

export function decomposeValue(val, unit) {
  const valNumber = +val;
  const valIsNumber = !isNaN(valNumber);
  const hasUnit = !is.und(unit);
  if (valIsNumber && !hasUnit) {
    return {
      type: valueTypes.NUMBER,
      original: valNumber,
      numbers: [valNumber],
      strings: []
    }
  } else if (valIsNumber && hasUnit) {
    // if (isNaN(val)) {
    //   console.log(val + unit);
    // }
    return {
      type: valueTypes.UNIT,
      original: val + unit,
      numbers: [valNumber],
      strings: [emptyString, unit]
    }
  } else if (is.col(val)) {
    const rgbaNumbers = convertColorStringValuesToRgbaArray(val);
    const rgbaString = rgbaStrings[0] + rgbaNumbers[0] + rgbaStrings[1] + rgbaNumbers[1] + rgbaStrings[2] + rgbaNumbers[2] + rgbaStrings[3] + rgbaNumbers[3] + rgbaStrings[4];
    return {
      type: valueTypes.COLOR,
      original: rgbaString,
      numbers: rgbaNumbers,
      strings: rgbaStrings
    }
  } else {
    // TO DO/ ONLY REPLACE VALUE IF UNITS ARE DIFFERENT
    // if (!is.num(val) && unit) {
    //   console.log(val, unit);
    // }
    const value = replaceValueUnitIfNecessary((is.pth(val) ? val.totalLength : val), unit) + emptyString;
    // console.log(val);
    // const value = (is.pth(val) ? val.totalLength : val) + emptyString;
    // console.log(value);
    return {
      original: value,
      numbers: value.match(digitWithExponentRgx) ? value.match(digitWithExponentRgx).map(Number) : [0],
      strings: (is.str(val) || unit) ? value.split(digitWithExponentRgx) : []
    }
  }
}

export const setValueByType = [
  (t, p, v) => t[p] = v,
  (t, p, v) => t.setAttribute(p, v),
  (t, p, v) => t.style[p] = v,
  (t, p, v, transforms, manual) => {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      transforms.string = emptyString;
      transforms.list.forEach((value, prop) => {
        transforms.string += `${prop}(${value})${emptyString}`;
      });
      t.style.transform = transforms.string;
    }
  }
]

export function getTargetValue(target, propName) {
  const animatables = getAnimatables(targets);
  if (animatables) {
    return getOriginalAnimatableValue(animatables[0], propName);
  }
}

export function setTargetsValue(targets, properties) {
  const animatables = getAnimatables(targets);
  animatables.forEach(animatable => {
    for (let property in properties) {
      const target = animatable.target;
      const animType = getAnimationType(target, property);
      const value = getFunctionValue(properties[property], animatable);
      const valueUnit = splitValueUnit(value)[2];
      const originalValue = getOriginalAnimatableValue(animatable, property, animType);
      const unit = valueUnit || splitValueUnit(originalValue)[2];
      const to = getRelativeValue(originalValue, replaceValueUnitIfNecessary(value, unit));
      setValueByType[animType](target, property, to, animatable.transforms, true);
    }
  });
}
