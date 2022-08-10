import {
  emptyString,
} from './consts.js';

import {
  is,
  stringContains,
  arrayContains,
} from './helpers.js';

import {
  convertPxToUnit,
  getTransformUnit,
  getUnit,
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
  whiteSpaceTestRgx,
  digitWithExponentRgx,
  validTransforms,
  animationTypes,
  valueTypes,
  rgbaStrings,
} from './consts.js';

import {
  convertColorStringValuesToRgbaArray
} from './colors.js';

export function getFunctionValue(functionValion, animatable) {
  if (!is.fnc(functionValion)) return functionValion;
  return functionValion(animatable.target, animatable.id, animatable.total) || 0; // Fallback to 0 if the function results in undefined / NaN / null
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

export function getOriginalTargetValue(target, propName, unit, animatable) {
  const animType = getAnimationType(target, propName);
  switch (animType) {
    case animationTypes.OBJECT: return target[propName] || 0;
    case animationTypes.ATTRIBUTE: return target.getAttribute(propName);
    case animationTypes.TRANSFORM: return getTransformValue(target, propName, animatable, unit);
    case animationTypes.CSS: return getCSSValue(target, propName, unit);
  }
}

export function getRelativeValue(to, from) {
  const operator = relativeValuesExecRgx.exec(to);
  if (!operator) return to;
  const u = getUnit(to) || 0;
  const x = parseFloat(from);
  const y = parseFloat(to.replace(operator[0], emptyString));
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function validateValue(val, unit) {
  // NEXT TO DO : FIGURE OUT A BETTER WAY TO HANDLE COMPLEX ANIMATIONS CONTAINING WHITE SPACES
  // If value contains a white space, do not attempt to add a unit
  if (whiteSpaceTestRgx.test(val)) return val;
  const originalUnit = getUnit(val);
  const unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) return unitLess + unit;
  return unitLess;
}

export function decomposeValue(val, unit) {
  if (is.num(val) && is.und(unit)) {
    return {
      type: valueTypes.NUMBER,
      original: val,
      numbers: [val],
      strings: []
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
    const value = validateValue((is.pth(val) ? val.totalLength : val), unit) + emptyString;
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

export function setTargetsValue(targets, properties) {
  const animatables = getAnimatables(targets);
  animatables.forEach(animatable => {
    for (let property in properties) {
      const value = getFunctionValue(properties[property], animatable);
      const target = animatable.target;
      const valueUnit = getUnit(value);
      const originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      const unit = valueUnit || getUnit(originalValue);
      const to = getRelativeValue(validateValue(value, unit), originalValue);
      const animType = getAnimationType(target, property);
      setValueByType[animType](target, property, to, animatable.transforms, true);
    }
  });
}
