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

export function getTransformValue(animatable, propName, clearCache) {
  const target = animatable.target;
  if (clearCache) {
    animatable.transforms.list.clear();
    const str = animatable.target.style.transform;
    if (str) {
      let t;
      while (t = transformsExecRgx.exec(str)) {
        animatable.transforms.list.set(t[1], t[2]);
      }
    }
  }
  const cachedValue = animatable.transforms.list.get(propName);
  return !is.und(cachedValue) ? cachedValue : (propName.includes(validTransforms[7]) ? 1 : 0) + getTransformUnit(propName);
}
