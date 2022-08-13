import {
  is,
} from './helpers.js';

import {
  getAnimationType,
} from './values.js';

import {
  convertKeyframesToTweens,
} from './tweens.js';

function createAnimation(animatable, keyframes) {
  const propertyName = keyframes[0].propertyName;
  const animType = getAnimationType(animatable.target, propertyName);
  if (is.num(animType)) {
    const tweens = convertKeyframesToTweens(keyframes, animatable, propertyName, animType);
    const firstTween = tweens[0];
    const lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
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
