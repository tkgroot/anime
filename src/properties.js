import {
  animationTypes,
  lowerCaseRgx,
  lowerCaseRgxParam,
} from './consts.js';

import {
  is,
} from './helpers.js';

import {
  cache,
} from './cache.js';

export function sanitizePropertyName(propertyName, targetEl, animationType) {
  if (
    (animationType === animationTypes.CSS) || 
    // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
    // but properties like "baseFrequency" should stay in lowerCamelCase
    (animationType === animationTypes.ATTRIBUTE && (is.svg(targetEl) && (propertyName in targetEl.style)))
  ) {
    const cachedPropertyName = cache.propertyNames[propertyName];
    if (cachedPropertyName) {
      return cachedPropertyName;
    } else {
      const lowerCaseName = propertyName.replace(lowerCaseRgx, lowerCaseRgxParam).toLowerCase();
      cache.propertyNames[propertyName] = lowerCaseName;
      return lowerCaseName;
    }
  } else {
    return propertyName;
  }
}
