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
        const animationKeyframesPropertyName = animationKeyframes[0].propertyName;
        const animationType = getAnimationType(target, animationKeyframesPropertyName);
        const propertyName = sanitizePropertyName(animationKeyframesPropertyName, target, animationType);
        if (is.num(animationType)) {
          const tweens = convertKeyframesToTweens(animationKeyframes, target, propertyName, animationType, i, targetsLength);
          const firstTween = tweens[0];
          const lastTween = tweens[tweens.length - 1];
          const animation = {
            type: animationType,
            property: propertyName,
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

// function createAnimation(animatable, keyframes) {
//   const keyframesPropertyName = keyframes[0].propertyName;
//   const animationType = getAnimationType(animatable, keyframesPropertyName);
//   const propertyName = sanitizePropertyName(keyframesPropertyName, animatable.target, animationType);
//   if (is.num(animationType)) {
//     const tweens = convertKeyframesToTweens(keyframes, animatable, propertyName, animationType);
//     const firstTween = tweens[0];
//     const lastTween = tweens[tweens.length - 1];
//     return {
//       type: animationType,
//       property: propertyName,
//       animatable: animatable,
//       tweens: tweens,
//       delay: firstTween.delay,
//       duration: lastTween.end,
//       endDelay: lastTween.endDelay,
//       timelineOffset: 0
//     }
//   }
// }

// export function getAnimations(animatables, animationsKeyframes) {
//   const animations = [];
//   for (let a = 0, aLength = animatables.length; a < aLength; a++) {
//     const animatable = animatables[a];
//     if (animatable) {
//       for (let p = 0, keysLength = animationsKeyframes.length; p < keysLength; p++) {
//         const animation = createAnimation(animatable, animationsKeyframes[p]);
//         if (animation) {
//           animations.push(animation);
//         }
//       }
//     }
//   }
//   return animations;
// }
