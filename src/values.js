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
} from './consts.js';

import {
  normalizeColorToRgba
} from './colors.js';

export function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) return val;
  return val(animatable.target, animatable.id, animatable.total);
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
    if (!is.nil(el.getAttribute(prop))) return animationTypes.ATTRIBUTE;
    if (arrayContains(validTransforms, prop)) return animationTypes.TRANSFORM;
    if (prop in el.style) return animationTypes.CSS;
    return console.warn(`Can't animate property '${prop}' on DOM element '${el}'.`);
  }
  return console.warn(`Target '${el}' can't be animated.`);
}

export function getOriginalTargetValue(target, propName, unit, animatable) {
  const animType = getAnimationType(target, propName);
  if (animType === animationTypes.OBJECT) return target[propName] || 0;
  if (animType === animationTypes.ATTRIBUTE) return target.getAttribute(propName);
  if (animType === animationTypes.TRANSFORM) return getTransformValue(target, propName, animatable, unit);
  if (animType === animationTypes.CSS) return getCSSValue(target, propName, unit);
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

export function validateValue(val, unit) {
  if (is.col(val)) return normalizeColorToRgba(val);
  if (whiteSpaceTestRgx.test(val)) return val;
  const originalUnit = getUnit(val);
  const unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) return unitLess + unit;
  return unitLess;
}

export function decomposeValue(val, unit) {
  const value = validateValue((is.pth(val) ? val.totalLength : val), unit) + emptyString;
  return {
    original: value,
    numbers: value.match(digitWithExponentRgx) ? value.match(digitWithExponentRgx).map(Number) : [0],
    strings: (is.str(val) || unit) ? value.split(digitWithExponentRgx) : []
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
