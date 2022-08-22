import {
  cache,
} from './cache.js';

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

export function getTransformValue(target, propName, clearCache) {
  const cachedTarget = cache.DOM.get(target);
  if (clearCache) {
    for (let key in cachedTarget.transforms) {
      delete cachedTarget.transforms[key];
    }
    const str = target.style.transform;
    if (str) {
      let t;
      while (t = transformsExecRgx.exec(str)) {
        cachedTarget.transforms[t[1]] = t[2];
      }
    }
  }
  const cachedValue = cachedTarget.transforms[propName];
  return !is.und(cachedValue) ? cachedValue : (propName.includes(validTransforms[7]) ? 1 : 0) + getTransformUnit(propName);
}
