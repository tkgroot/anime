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
  if (clearCache) {
    for (let key in animatable.transforms) {
      delete animatable.transforms[key];
    }
    const str = animatable.target.style.transform;
    if (str) {
      let t;
      while (t = transformsExecRgx.exec(str)) {
        animatable.transforms[t[1]] = t[2];
      }
    }
  }
  const cachedValue = animatable.transforms[propName];
  return !is.und(cachedValue) ? cachedValue : (propName.includes(validTransforms[7]) ? 1 : 0) + getTransformUnit(propName);
}
