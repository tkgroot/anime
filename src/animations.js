import {
  animationTypes,
} from './consts.js';

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

export function getAnimations(targets, keyframes) {
  const animations = [];
  let animationsIndex = 0;
  for (let i = 0, targetsLength = targets.length; i < targetsLength; i++) {
    const target = targets[i];
    if (target) {
      let lastAnimatableTransformAnimationIndex;
      for (let j = 0, keysLength = keyframes.length; j < keysLength; j++) {
        const animationKeyframes = keyframes[j];
        const animationKeyframesPropertyName = animationKeyframes[0].property;
        const animationType = getAnimationType(target, animationKeyframesPropertyName);
        const tweenPropertyName = sanitizePropertyName(animationKeyframesPropertyName, target, animationType);
        if (is.num(animationType)) {
          const tweens = convertKeyframesToTweens(animationKeyframes, target, tweenPropertyName, animationType, i, targetsLength);
          const firstTween = tweens[0];
          const lastTween = tweens[tweens.length - 1];
          const animation = {
            type: animationType,
            target: target,
            tweens: tweens,
            delay: firstTween.delay,
            duration: lastTween.end,
            endDelay: lastTween.endDelay,
            timelineOffset: 0
          }
          if (animationType === animationTypes.TRANSFORM) {
            lastAnimatableTransformAnimationIndex = animationsIndex;
          }
          animations.push(animation);
          animationsIndex++;
        }
      }
      if (!is.und(lastAnimatableTransformAnimationIndex)) {
        animations[lastAnimatableTransformAnimationIndex].renderTransforms = true;
      }
    }
  }
  return animations;
}
