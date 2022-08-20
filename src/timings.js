import {
  is
} from './utils.js';

export function getTimingsFromAnimations(animations, tweenSettings) {
  const animationsLength = animations.length;
  if (!animationsLength) {
    return tweenSettings;
  } else {
    const timings = {};
    for (let i = 0; i < animationsLength; i++) {
      const anim = animations[i];
      const delay = anim.timelineOffset + anim.delay;
      if (is.und(timings.delay) || delay < timings.delay) {
        timings.delay = delay;
      }
      const duration = anim.timelineOffset + anim.duration;
      if (is.und(timings.duration) || duration > timings.duration) {
        timings.duration = duration;
      }
      const endDelay = anim.timelineOffset + anim.duration - anim.endDelay;
      if (is.und(timings.endDelay) || endDelay > timings.endDelay) {
        timings.endDelay = endDelay;
      }
    }
    timings.endDelay = timings.duration - timings.endDelay;
    return timings;
  }
}
