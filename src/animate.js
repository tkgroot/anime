import {
  settings,
  defaultInstanceSettings,
  defaultTweenSettings,
  minValue,
} from './consts.js';

import {
  clamp,
  filterArray,
  replaceObjectProps,
  mergeObjects,
} from './utils.js';

import {
  recomposeValueFunctions,
  setAnimationValueFunctions,
} from './values.js';

import {
  startEngine,
  activeInstances,
} from './engine.js';

import {
  getAnimatables,
  removeAnimatablesFromInstance,
} from './animatables.js';

import {
  getAnimations,
} from './animations.js';

import {
  getTimingsFromAnimations,
} from './timings.js';

import {
  getKeyframesFromProperties,
} from './keyframes.js';

let instancesId = 0;

export function createInstance(params) {
  const instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  const tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  const properties = getKeyframesFromProperties(tweenSettings, params);
  const targets = getAnimatables(params.targets);
  const animations = getAnimations(targets, properties);
  const timings = getTimingsFromAnimations(animations, tweenSettings);
  return mergeObjects(instanceSettings, {
    id: instancesId++,
    children: [],
    targets: targets,
    animations: animations,
    delay: timings.delay,
    duration: timings.duration,
    endDelay: timings.endDelay,
  });
}

export function animate(params = {}) {
  let startTime = 0, lastTime = 0, now = 0;
  let children, childrenLength = 0;
  let resolve = null;

  function makePromise(instance) {
    const promise = window.Promise && new Promise(_resolve => resolve = _resolve);
    instance.finished = promise;
    return promise;
  }

  let instance = createInstance(params);
  let promise = makePromise(instance);

  function toggleInstanceDirection() {
    const direction = instance.direction;
    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }
    instance.reversed = !instance.reversed;
    children.forEach(child => child.reversed = instance.reversed);
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / settings.speed);
  }

  function seekChild(time, child, muteCallbacks) {
    if (child) {
      if (!muteCallbacks) {
        child.seek(time - child.timelineOffset);
      } else {
        child.seekSilently(time - child.timelineOffset);
      }
    }
  }

  function syncInstanceChildren(time, muteCallbacks) {
    if (!instance.reversePlayback) {
      for (let i = 0; i < childrenLength; i++) seekChild(time, children[i], muteCallbacks);
    } else {
      for (let j = childrenLength; j--;) seekChild(time, children[j], muteCallbacks);
    }
  }

  function setAnimationsProgress(insTime) {
    let i = 0;
    const animations = instance.animations;
    const animationsLength = animations.length;
    while (i < animationsLength) {
      const animation = animations[i];
      const target = animation.target;
      const tweens = animation.tweens;
      const tweensLength = tweens.length - 1;
      let tween = tweens[tweensLength];
      // Only check for keyframes if there is more than one tween
      if (tweensLength) tween = filterArray(tweens, t => (insTime < t.end))[0] || tween;
      tween.progress = tween.easing(clamp(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration);
      tween.value = recomposeValueFunctions[tween.type](tween);
      setAnimationValueFunctions[animation.type](target, animation.property, tween.value, animation.renderTransforms);
      animation.currentValue = tween.value;
      i++;
    }
  }

  function countIteration() {
    if (instance.remainingLoops && instance.remainingLoops !== true) {
      instance.remainingLoops--;
    }
  }

  function setInstanceProgress(engineTime) {
    const insDuration = instance.duration;
    const insDelay = instance.delay;
    const insEndDelay = insDuration - instance.endDelay;
    const insTime = adjustTime(engineTime);
    instance.progress = clamp((insTime / insDuration), 0, 1);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) { syncInstanceChildren(insTime); }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      instance.begin(instance);
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      instance.loopBegin(instance);
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        instance.changeBegin(instance);
      }
      instance.change(instance);
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        instance.changeComplete(instance);
      }
    }
    instance.currentTime = clamp(insTime, 0, insDuration);
    if (instance.began) instance.update(instance);
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remainingLoops) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          instance.loopComplete(instance);
          instance.complete(instance);
          resolve();
          promise = makePromise(instance);
        }
      } else {
        startTime = now;
        instance.loopComplete(instance);
        instance.loopBegan = false;
        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function() {
    const direction = instance.direction;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remainingLoops = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (let i = childrenLength; i--;) instance.children[i].reset();
    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) instance.remainingLoops++;
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  }

  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
  instance._onDocumentVisibility = resetTime;

  instance.tick = function(t) {
    now = t;
    if (!startTime) startTime = now;
    setInstanceProgress((now + (lastTime - startTime)) * settings.speed);
  }

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  }

  instance.seekSilently = function(time) {
    // const insTime = adjustTime(time);
    if (children) { syncInstanceChildren(time, true); }
    setAnimationsProgress(time);
  }

  instance.pause = function() {
    instance.paused = true;
    resetTime();
  }

  instance.play = function() {
    if (!instance.paused) return;
    if (instance.completed) instance.reset();
    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    startEngine();
  }

  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  }

  instance.restart = function() {
    instance.reset();
    instance.play();
  }

  instance.remove = function(targets) {
    removeAnimatablesFromInstance(targets, instance);
  }

  instance.reset();

  if (instance.autoplay) {
    if (instance.duration === minValue) {
      instance.seek(minValue);
    } else {
      instance.play();
    }
  }

  return instance;
}
