import {
  is,
} from './utils.js';

import {
  sanitizePropertyName,
} from './properties.js';

import {
  convertKeyframesToTweens,
} from './tweens.js';

import {
  getAnimationType,
} from './values.js';

function createAnimation(animatable, keyframes) {
  const keyframesPropertyName = keyframes[0].propertyName;
  const animationType = getAnimationType(animatable.target, keyframesPropertyName);
  const propertyName = sanitizePropertyName(keyframesPropertyName, animatable.target, animationType);
  if (is.num(animationType)) {
    const tweens = convertKeyframesToTweens(keyframes, animatable, propertyName, animationType);
    const firstTween = tweens[0];
    const lastTween = tweens[tweens.length - 1];
    return {
      type: animationType,
      property: propertyName,
      animatable: animatable,
      tweens: tweens,
      delay: firstTween.delay,
      duration: lastTween.end,
      endDelay: lastTween.endDelay,
      timelineOffset: 0
    }
  }
}

export function getAnimations(animatables, animationsKeyframes) {
  const animations = [];
  for (let a = 0, aLength = animatables.length; a < aLength; a++) {
    const animatable = animatables[a];
    if (animatable) {
      for (let p = 0, pLength = animationsKeyframes.length; p < pLength; p++) {
        const animation = createAnimation(animatable, animationsKeyframes[p]);
        if (animation) {
          animations.push(animation);
        }
      }
    }
  }
  return animations;
}
