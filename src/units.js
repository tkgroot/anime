import {
  cache,
} from './cache.js';

import {
  valueTypes,
  tinyNumber,
} from './consts.js';

import {
  is,
  clamp,
  stringContains,
  arrayContains,
} from './helpers.js';

// Return an array [original value, operator (+=, -=, *=), value number, value unit];

export function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') return 'px';
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
}

const nonConvertableUnitsYet = ['', 'deg', 'rad', 'turn'];

export function convertPxToUnit(el, decomposedValue, unit) {
  nonConvertableUnitsYet[0] = unit;
  if (decomposedValue.type === valueTypes.UNIT && arrayContains(nonConvertableUnitsYet, decomposedValue.unit)) {
    return decomposedValue;
  }
  const valueNumber = decomposedValue.number;
  const cached = cache.CSS[valueNumber + unit];
  if (!is.und(cached)) return cached;
  const baseline = 100;
  const tempEl = document.createElement(el.tagName);
  const parentNode = el.parentNode;
  const parentEl = (parentNode && (parentNode !== document)) ? parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  const factor = tempEl.offsetWidth ? (baseline / tempEl.offsetWidth) : 0;
  parentEl.removeChild(tempEl);
  decomposedValue.type === valueTypes.UNIT;
  decomposedValue.number = factor * parseFloat(valueNumber);
  decomposedValue.unit = unit;
  cache.CSS[valueNumber + unit] = decomposedValue;
  return decomposedValue;
}
