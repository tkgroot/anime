import {
  defaultInstanceSettings,
  defaultTweenSettings,
} from './consts.js';

import {
  clamp,
  random,
  is,
  filterArray,
  flattenArray,
  toArray,
  arrayContains,
  cloneObject,
  replaceObjectProps,
  mergeObjects,
} from './helpers.js';

import {
  parseEasings,
  penner,
  spring,
} from './easings.js';

import {
  getUnit,
  convertPxToUnit,
} from './units.js';

import {
  getOriginalTargetValue,
  getElementTransforms,
  getAnimationType,
  getFunctionValue,
  getRelativeValue,
  setValueByType,
  validateValue,
  decomposeValue,
} from './values.js';

import {
  setDashoffset,
  getPath,
  getPathProgress,
} from './svg.js';

import {
  getAnimatables,
  removeAnimatablesFromActiveInstances,
} from './animatables.js';

import {
  getTimingsFromAnimations,
} from './timings.js';

import {
  createTimeline,
} from './timelines.js';

import {
  startEngine,
  activeInstances,
} from './engine.js';

import {
  animate,
} from './animate.js';

import {
  stagger,
} from './stagger.js';

// Timeline

function timeline(params = {}) {
  let tl = animate(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    const tlIndex = activeInstances.indexOf(tl);
    const children = tl.children;
    if (tlIndex > -1) activeInstances.splice(tlIndex, 1);
    let insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    const tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    tl.seekSilently(insParams.timelineOffset);
    const ins = animate(insParams);
    const totalDuration = ins.duration + insParams.timelineOffset;
    children.push(ins);
    const timings = getTimingsFromAnimations(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seekSilently(0);
    tl.reset();
    if (tl.autoplay) tl.play();
    return tl;
  }
  return tl;
}

// Set Value helper

function setTargetsValue(targets, properties) {
  const animatables = getAnimatables(targets);
  animatables.forEach(animatable => {
    for (let property in properties) {
      const value = getFunctionValue(properties[property], animatable);
      const target = animatable.target;
      const valueUnit = getUnit(value);
      const originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      const unit = valueUnit || getUnit(originalValue);
      const to = getRelativeValue(validateValue(value, unit), originalValue);
      const animType = getAnimationType(target, property);
      setValueByType[animType](target, property, to, animatable.transforms, true);
    }
  });
}

const anime = animate;

anime.version = '__packageVersion__';
anime.speed = 1;
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeAnimatablesFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.clamp = clamp;
anime.random = random;

export default anime;
