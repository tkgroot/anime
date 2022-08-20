import {
  transformsExecRgx,
  validTransforms,
} from './consts.js';

import {
  is,
} from './utils.js';

import {
  getTransformUnit,
} from './units.js';

export function getElementTransforms(el) {
  if (!is.dom(el)) return;
  const str = el.style.transform;
  const transforms = new Map();
  if (!str) return transforms;
  let t;
  while (t = transformsExecRgx.exec(str)) {
    transforms.set(t[1], t[2]);
  }
  return transforms;
}

export function getTransformValue(animatable, propName) {
  const target = animatable.target;
  const defaultVal = propName.includes(validTransforms[7]) ? 1 : 0 + getTransformUnit(propName);
  const value = getElementTransforms(target).get(propName) || defaultVal;
  animatable.transforms.list.set(propName, value);
  animatable.transforms.last = propName;
  return value;
}
