import {
  cache,
} from './cache.js';

import {
  valueTypes,
} from './consts.js';

import {
  is,
  stringContains,
  arrayContains,
} from './helpers.js';

// Return an array [original value, operator (+=, -=, *=), value number, value unit];

export function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') return 'px';
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
}

const nonConvertableUnitsYet = ['', 'deg', 'rad', 'turn'];

export function convertPxToUnit(el, value, unit) {
  nonConvertableUnitsYet[0] = unit;
  if (value.type === valueTypes.UNIT && arrayContains(nonConvertableUnitsYet, value.unit)) {
    return value;
  }
  const valueNumber = value.number;
  const cached = cache.CSS[valueNumber + unit];
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
  const convertedValue = factor * parseFloat(valueNumber);
  cache.CSS[valueNumber + unit] = convertedValue;
  return convertedValue;
}
