import {
  validTransforms,
  animationTypes,
  valueTypes,
  emptyString,
  openParenthesisString,
  closeParenthesisString,
  rgbaStrings,
  transformsExecRgx,
  relativeValuesExecRgx,
  digitWithExponentRgx,
  unitsExecRgx,
} from './consts.js';

import {
  is,
  arrayContains,
  round,
} from './helpers.js';

import {
  convertValueUnit,
  getTransformUnit,
} from './units.js';

import {
  sanitizePropertyName,
} from './properties.js';

import {
  getTransformValue,
} from './transforms.js';

import {
  getAnimatables,
} from './animatables.js';

import {
  getPathProgress
} from './svg.js';

import {
  convertColorStringValuesToRgbaArray
} from './colors.js';

export function getFunctionValue(functionValue, animatable) {
  if (!is.fnc(functionValue)) return functionValue;
  return functionValue(animatable.target, animatable.id, animatable.total) || 0; // Fallback to 0 if the function results in undefined / NaN / null
}

export function getAnimationType(el, prop) {
  if (is.obj(el)) {
    return animationTypes.OBJECT;
  } else if (is.dom(el)) {
    if (!is.nil(el.getAttribute(prop)) || (is.svg(el) && prop in el.style)) return animationTypes.ATTRIBUTE; // Handle DOM and SVG attributes
    // if (!is.nil(el.getAttribute(prop))) return animationTypes.ATTRIBUTE; // Handle DOM and SVG attributes
    if (arrayContains(validTransforms, prop)) return animationTypes.TRANSFORM; // Handle CSS Transform properties differently than CSS to allow individual animations
    if (prop in el.style) return animationTypes.CSS; // All other CSS properties
    if (!is.und(el[prop])) return animationTypes.OBJECT; // Handle DOM elements properies that can't be accessed using getAttribute()
    return console.warn(`Can't find property '${prop}' on target '${el}'.`);
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
    case animationTypes.CSS: return target.style[propName] || getComputedStyle(target).getPropertyValue(propName);
  }
}

export function getRelativeValue(x, y, operator) {
  switch (operator) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
  }
}

export function decomposeValue(rawValue) {
  let val = rawValue;
  const value = {
    type: valueTypes.NUMBER,
  };
  const numberedVal = +val;
  if (!isNaN(numberedVal)) {
    value.number = numberedVal;
    return value;
  } else if (rawValue.isPath) {
    value.type = valueTypes.PATH;
    value.path = rawValue;
    value.number = value.path.totalLength;
    value.unit = emptyString;
    return value;
  } else {
    const operatorMatch = relativeValuesExecRgx.exec(val);
    if (operatorMatch) {
      val = val.slice(2);
      value.operator = operatorMatch[0][0];
    }
    const unitMatch = unitsExecRgx.exec(val);
    if (unitMatch) {
      value.type = valueTypes.UNIT;
      value.number = +unitMatch[1];
      value.unit = unitMatch[2];
      return value;
    } else if (value.operator) {
      value.number = +val;
      return value;
    } else if (is.col(val)) {
      value.type = valueTypes.COLOR;
      value.numbers = convertColorStringValuesToRgbaArray(val);
      return value;
    } else {
      const stringifiedVal = val + emptyString;
      const matchedNumbers = stringifiedVal.match(digitWithExponentRgx);
      value.type = valueTypes.COMPLEX;
      value.numbers = matchedNumbers ? matchedNumbers.map(Number) : [0];
      value.strings = stringifiedVal.split(digitWithExponentRgx) || [];
      return value;
    }
  }
}

function getNumberProgress(fromNumber, toNumber, progressValue, roundValue) {
  let value = fromNumber + (progressValue * (toNumber - fromNumber));
  if (roundValue) return round(value, roundValue);
  return value;
}

function recomposeNumberValue(tween) {
  return getNumberProgress(tween.from.number, tween.to.number, tween.progress, tween.round);
}

function recomposeUnitValue(tween) {
  return getNumberProgress(tween.from.number, tween.to.number, tween.progress, tween.round) + tween.to.unit;
}

function recomposeColorValue(tween) {
  const fn = tween.from.numbers;
  const tn = tween.to.numbers;
  let value = rgbaStrings[0];
  value += getNumberProgress(fn[0], tn[0], tween.progress, 1) + rgbaStrings[1];
  value += getNumberProgress(fn[1], tn[1], tween.progress, 1) + rgbaStrings[2];
  value += getNumberProgress(fn[2], tn[2], tween.progress, 1) + rgbaStrings[3];
  value += getNumberProgress(fn[3], tn[3], tween.progress) + rgbaStrings[4];
  return value;
}

function recomposePathValue(tween) {
  let value = getPathProgress(tween.to.path, tween.progress * tween.to.number) + tween.to.unit;
  if (tween.round) return round(value, tween.round);
  return value;
}

function recomposeComplexValue(tween) {
  let value = tween.to.strings[0];
  for (let i = 0, l = tween.to.numbers.length; i < l; i++) {
    const number = getNumberProgress(tween.from.numbers[i], tween.to.numbers[i], tween.progress, tween.round);
    const nextString = tween.to.strings[i + 1];
    if (!nextString) {
      value += number;
    } else {
      value += number + nextString;
    }
  }
  return value;
}

export const recomposeValueFunctions = [
  recomposeNumberValue,
  recomposeUnitValue,
  recomposeColorValue,
  recomposePathValue,
  recomposeComplexValue,
]

function setObjectAnimationValue(t, p, v) {
  return t[p] = v;
}

function setAttributeAnimationValue(t, p, v) {
  return t.setAttribute(p, v);
}

function setCssAnimationValue(t, p, v) {
  return t.style[p] = v;
}

function setTransformsAnimationValue(t, p, v, transforms, manual) {
  transforms.list.set(p, v);
  if (p === transforms.last || manual) {
    transforms.string = emptyString;
    transforms.list.forEach((value, prop) => transforms.string += `${prop}${openParenthesisString}${value}${closeParenthesisString}`);
    return t.style.transform = transforms.string;
  }
}

export const setAnimationValueFunctions = [
  setObjectAnimationValue,
  setAttributeAnimationValue,
  setCssAnimationValue,
  setTransformsAnimationValue,
]

// NEEDS TESTING

export function getTargetValue(target, propName, unit) {
  const animatables = getAnimatables(target);
  if (animatables) {
    const animatable = animatables[0];
    let value = getOriginalAnimatableValue(animatable, propName);
    if (unit) {
      const decomposedValue = decomposeValue(value);
      if (decomposedValue.type === valueTypes.NUMBER || decomposedValue.type === valueTypes.UNIT) {
        const convertedValue = convertValueUnit(animatable.target, decomposedValue, unit);
        value = convertedValue.number + convertedValue.unit;
      }
    }
    return value;
  }
}

// NEEDS TESTING

export function setTargetsValue(targets, properties) {
  const animatables = getAnimatables(targets);
  animatables.forEach(animatable => {
    for (let property in properties) {
      const target = animatable.target;
      const animType = getAnimationType(target, property);
      const value = getFunctionValue(properties[property], animatable);
      const decomposedValue = decomposeValue(value);
      const propertyName = sanitizePropertyName(property, target, animType);
      const originalValue = decomposeValue(getOriginalAnimatableValue(animatable, propertyName, animType));
      if (originalValue.type === valueTypes.UNIT && decomposedValue.type === valueTypes.NUMBER) {
        decomposedValue.type = valueTypes.UNIT;
        decomposedValue.unit = originalValue.unit;
      }
      const recomposedValue = recomposeValueFunctions[decomposedValue.type]({
        from: originalValue,
        to: decomposedValue,
        progress: 1,
      });
      setAnimationValueFunctions[animType](target, propertyName, recomposedValue, animatable.transforms, true);
    }
  });
}
