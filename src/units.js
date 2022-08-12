import {
  cache,
} from './cache.js';

import {
  unitsExecRgx,
} from './consts.js';

import {
  is,
  stringContains,
  arrayContains,
} from './helpers.js';

// Return an array [original value, operator (+=, -=, *=), value number, value unit];
export function splitValueUnit(val) {
  const unitMatch = unitsExecRgx.exec(val);
  if (unitMatch) {
    unitMatch[2] = +unitMatch[2]; // Convert the string value to a number
    return unitMatch;
  } else {
    return [val];
  }
}

export function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') return 'px';
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
}

export function convertPxToUnit(el, value, unit) {
  const valueUnit = splitValueUnit(value)[3];
  if (valueUnit && arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
    return value;
  }
  const cached = cache.CSS[value + unit];
  if (!is.und(cached)) return cached;
  const baseline = 100;
  const tempEl = document.createElement(el.tagName);
  const parentNode = el.parentNode;
  const parentEl = (parentNode && (parentNode !== document)) ? parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  const factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  const convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}
