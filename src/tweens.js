import {
  is,
} from './helpers.js';

import {
  parseEasings,
} from './easings.js';

import {
  getFunctionValue,
  getOriginalAnimatableValue,
  getRelativeValue,
  getComputedValue,
  decomposeValue,
} from './values.js';

import {
  splitValueUnit,
} from './units.js';

// Tweens

function convertKeyframeToTween(keyframe, animatable) {
  const tween = {};
  for (let p in keyframe) {
    let prop = getFunctionValue(keyframe[p], animatable);
    if (is.arr(prop)) {
      prop = prop.map(v => getFunctionValue(v, animatable));
      if (prop.length === 1) {
        prop = prop[0];
      }
    }
    tween[p] = prop;
  }
  // Make sure duration is not equal to 0 to prevents NaN when (progress = 0 / duration = 0);
  tween.duration = parseFloat(tween.duration) || Number.MIN_VALUE;
  tween.delay = parseFloat(tween.delay);
  return tween;
}

export function convertKeyframesToTweens(keyframes, animatable, propertyName, animationType) {
  let previousTween;
  const tweens = [];
  for (let i = 0, l = keyframes.length; i < l; i++) {
    const keyframe = keyframes[i];
    const tween = convertKeyframeToTween(keyframe, animatable);
    const tweenValue = tween.value;
    const isFromToValue = is.arr(tweenValue);
    const originalValue = getOriginalAnimatableValue(animatable, propertyName, animationType);
    const previousValue = previousTween ? previousTween.to.original : originalValue;

    let previousValue2 = previousTween ? previousTween.to : originalValue;

    const keyTo = (isFromToValue ? tweenValue[1] : tweenValue);
    const to = !is.und(keyTo) ? keyTo : previousValue;
    const toComputed = !is.und(keyTo) ? getComputedValue(keyTo) : previousTween ? previousTween.computedTo : getComputedValue(getOriginalAnimatableValue(animatable, propertyName, animationType));
    const toSplitted = splitValueUnit(to);
    const toNumber = toSplitted[2];
    const toUnit = toSplitted[3];

    const from = isFromToValue ? tweenValue[0] : previousValue;
    const fromComputed = isFromToValue ? getComputedValue(tweenValue[0]) : previousTween ? previousTween.computedTo : getComputedValue(getOriginalAnimatableValue(animatable, propertyName, animationType));
    const fromSplitted = splitValueUnit(from);
    const fromNumber = fromSplitted[2];
    // In case of [from, to] values, checking the original value unit is necessary if no units are provided in the values.
    const fromUnit = fromSplitted[3] || (isFromToValue ? splitValueUnit(previousValue)[3] : undefined);

    console.log(fromComputed, toComputed);

    const unit = toUnit || fromUnit;

    tween.from = decomposeValue(getRelativeValue(previousValue, from), unit);
    tween.to = decomposeValue(getRelativeValue(from, to), unit);
    tween.computedFrom = toComputed;
    tween.computedTo = fromComputed;
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = !is.und(tweenValue) && is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) {
      tween.round = 1;
    }
    previousTween = tween;
    tweens.push(tween);
  }
  return tweens;
}
