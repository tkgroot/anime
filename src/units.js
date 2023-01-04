import {
  cache,
} from './cache.js';

import {
  valueTypes,
  minValue,
} from './consts.js';

import {
  is,
  clamp,
} from './utils.js';

export function getTransformUnit(propName) {
  if (propName.includes('scale')) return 0;
  if (propName.includes('rotate') || propName.includes('skew')) return 'deg';
  return 'px';
}

const nonConvertableUnitsYet = ['', 'deg', 'rad', 'turn'];

export function convertValueUnit(el, decomposedValue, unit) {
  nonConvertableUnitsYet[0] = unit;
  if (decomposedValue.type === valueTypes.UNIT && nonConvertableUnitsYet.includes(decomposedValue.unit)) {
    return decomposedValue;
  }
  const valueNumber = decomposedValue.number;
  const valueUnit = decomposedValue.unit;
  const cached = cache.CSS[valueNumber + valueUnit + unit];
  if (!is.und(cached)) {
    decomposedValue.number = cached;
  } else {
    const baseline = 100;
    const tempEl = document.createElement(el.tagName);
    const parentNode = el.parentNode;
    const parentEl = (parentNode && (parentNode !== document)) ? parentNode : document.body;
    parentEl.appendChild(tempEl);
    tempEl.style.position = 'absolute';
    tempEl.style.width = baseline + valueUnit;
    const currentUnitWidth = tempEl.offsetWidth ? (tempEl.offsetWidth / 100) : 0;
    tempEl.style.width = baseline + unit;
    const newUnitWidth = tempEl.offsetWidth ? (tempEl.offsetWidth / 100) : 0;
    const factor = tempEl.offsetWidth ? (currentUnitWidth / newUnitWidth) : 0;
    parentEl.removeChild(tempEl);
    const convertedValue = factor * valueNumber;
    decomposedValue.number = convertedValue;
    cache.CSS[valueNumber + valueUnit + unit] = convertedValue;
  }
  decomposedValue.type === valueTypes.UNIT;
  decomposedValue.unit = unit;
  return decomposedValue;
}
